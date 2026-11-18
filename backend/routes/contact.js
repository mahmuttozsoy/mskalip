const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Public: İletişim mesajı gönder
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ error: 'Ad ve mesaj alanları zorunludur' });
    }
    
    const ip = req.ip || req.connection.remoteAddress;
    
    await db.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, subject, message, ip]
    );
    
    res.json({ success: true, message: 'Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Mesajları listele
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { is_read, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = [];
    let params = [];
    
    if (is_read !== undefined) { where.push('is_read = ?'); params.push(is_read === 'true' ? 1 : 0); }
    
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const [rows] = await db.query(
      `SELECT * FROM contact_messages ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM contact_messages ${whereStr}`, params);
    const [[{ unread }]] = await db.query('SELECT COUNT(*) as unread FROM contact_messages WHERE is_read = 0');
    
    res.json({ messages: rows, total, unread });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Mesajı okundu işaretle
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Admin: Mesajı sil
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Mesaj silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
