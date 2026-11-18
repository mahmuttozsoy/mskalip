const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ categories: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json({ categories: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, slug, description, icon, sort_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description, icon, sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, slug, description, icon, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE categories SET name=?, slug=?, description=?, icon=?, sort_order=?, is_active=? WHERE id=?',
      [name, slug, description, icon, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Kategori güncellendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Kategori silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
