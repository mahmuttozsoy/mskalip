const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Public: Tüm projeleri listele
router.get('/', async (req, res) => {
  try {
    const { category, featured, status, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = ['p.is_active = 1'];
    let params = [];
    
    if (category) { where.push('c.slug = ?'); params.push(category); }
    if (featured) { where.push('p.is_featured = ?'); params.push(featured === 'true' ? 1 : 0); }
    if (status) { where.push('p.status = ?'); params.push(status); }
    
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const [projects] = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT file_path FROM media WHERE project_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereStr}
      ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);
    
    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) as total FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereStr}
    `, params);
    
    res.json({ projects, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Public: Tek proje getir
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_active = 1
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }
    
    const project = rows[0];
    
    // Projeye ait medyaları getir
    const [media] = await db.query(
      'SELECT * FROM media WHERE project_id = ? ORDER BY is_cover DESC, sort_order ASC',
      [project.id]
    );
    
    project.media = media;
    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Proje ekle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO projects (category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, title, slug, description, short_description, location, area, year, status || 'tamamlandi', is_featured ? 1 : 0, sort_order || 0]
    );
    
    res.status(201).json({ success: true, id: result.insertId, message: 'Proje başarıyla eklendi' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
    }
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Proje güncelle
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order, is_active } = req.body;
    
    await db.query(
      `UPDATE projects SET category_id=?, title=?, slug=?, description=?, short_description=?,
       location=?, area=?, year=?, status=?, is_featured=?, sort_order=?, is_active=?
       WHERE id=?`,
      [category_id, title, slug, description, short_description, location, area, year, status, is_featured ? 1 : 0, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );
    
    res.json({ success: true, message: 'Proje başarıyla güncellendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Proje sil
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Proje başarıyla silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
