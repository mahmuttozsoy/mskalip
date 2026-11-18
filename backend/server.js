const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const initDatabase = require('./config/initDb');

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Statik dosyalar (yüklenen medya - backend/uploads, frontend/public/uploads ve frontend/dist/uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'frontend', 'public', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'frontend', 'dist', 'uploads')));

// API Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const serviceRoutes = require('./routes/services');
const mediaRoutes = require('./routes/media');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const statsRoutes = require('./routes/stats');
const sliderRoutes = require('./routes/sliders');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sliders', sliderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MŞ Group API çalışıyor',
    dbStatus: initDatabase.getDbStatus(),
    timestamp: new Date(),
  });
});

// Canlı (Production) modda frontend/dist varsa doğrudan sun
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Tüm /api ve /uploads dışındaki GET isteklerini React SPA (index.html) uygulamasına yönlendir (Express 4 & 5 tam uyumlu)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.status(200).send('MŞ Group API Sunucusu Çalışıyor');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Sunucu hatası',
  });
});

// Phusion Passenger / Hostinger için app.listen SENKRON olarak hemen çağrılmalıdır (503 hatasını önler)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MŞ Group sunucusu port ${PORT}'de çalışıyor`);
});

// Veritabanı ve medya senkronizasyonunu arka planda başlat
initDatabase().catch((err) => {
  console.error('Veritabanı başlatma uyarısı:', err.message);
});

module.exports = app;
