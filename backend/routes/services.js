const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ services: rows });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, description, short_description, icon, sort_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO services (title, slug, description, short_description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, description, short_description, icon, sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, description, short_description, icon, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE services SET title=?, slug=?, description=?, short_description=?, icon=?, sort_order=?, is_active=? WHERE id=?',
      [title, slug, description, short_description, icon, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Hizmet güncellendi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Hizmet silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
