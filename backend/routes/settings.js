const express = require('express');
const router = express.Router();
const db = require('../config/database');
const initDatabase = require('../config/initDb');
const { authenticateToken } = require('../middleware/auth');

// Public: Tüm ayarları getir
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value, setting_type FROM settings');
    const settings = {};
    rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
    res.json({ settings, dbStatus: initDatabase.getDbStatus() });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Veritabanı bağlantı durumunu getir
router.get('/db-status', async (req, res) => {
  res.json({ dbStatus: initDatabase.getDbStatus() });
});

// MySQL bağlantısını kur, tabloları oluştur ve verileri aktar
router.post('/mysql-connect', async (req, res) => {
  try {
    const { host, port, user, password, database } = req.body;
    const result = await initDatabase.connectAndSetupMySQL({
      host: host || 'localhost',
      port: port || 3306,
      user: user || 'root',
      password: password || '',
      database: database || 'mskalip',
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: `MySQL bağlantısı kurulamadı: ${err.message}`,
      dbStatus: initDatabase.getDbStatus(),
    });
  }
});

// Admin: Ayarları güncelle
router.put('/', authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    
    res.json({ success: true, message: 'Ayarlar güncellendi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
