const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    await db.query('DELETE FROM stats WHERE id > 4').catch(() => {});
    const [rows] = await db.query('SELECT * FROM stats WHERE is_active = 1 ORDER BY id ASC LIMIT 4');
    res.json({ stats: rows });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, value, icon, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE stats SET title=?, value=?, icon=?, sort_order=?, is_active=? WHERE id=?',
      [title, value, icon, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'İstatistik güncellendi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
