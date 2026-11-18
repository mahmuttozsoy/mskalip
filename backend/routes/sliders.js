const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sliders WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ sliders: rows });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, image_path, button_text, button_link, sort_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO sliders (title, subtitle, image_path, button_text, button_link, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle, image_path, button_text, button_link, sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, image_path, button_text, button_link, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE sliders SET title=?, subtitle=?, image_path=?, button_text=?, button_link=?, sort_order=?, is_active=? WHERE id=?',
      [title, subtitle, image_path, button_text, button_link, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM sliders WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
