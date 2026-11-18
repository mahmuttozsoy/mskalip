const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    }

    const [rows] = await db.query(
      'SELECT * FROM admins WHERE (username = ? OR email = ?) AND is_active = 1',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'shahgroup_default_secret_key_2025',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Mevcut kullanıcı bilgileri
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Şifre değiştir
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    const [rows] = await db.query('SELECT * FROM admins WHERE id = ?', [req.user.id]);
    const admin = rows[0];
    
    const isValid = await bcrypt.compare(current_password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Mevcut şifre hatalı' });
    }
    
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
