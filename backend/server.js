const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const initDatabase = require('./config/initDb');

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Statik dosyalar (yüklenen medya - hem backend/uploads hem frontend/public/uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'frontend', 'public', 'uploads')));

// Routes
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
if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Geliştirme modunda localhost:5000 bilgilendirme & MySQL Hızlı Kurulum ekranı
  app.get('/', (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const dbStatus = initDatabase.getDbStatus();
    const isMysql = dbStatus.mode === 'mysql';
    res.send(`
      <!doctype html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <title>MŞ Group API & MySQL Kurulumu</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f0f1a; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: #1a1a2e; border: 1px solid rgba(184,134,11,0.3); border-radius: 16px; padding: 36px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
            h1 { color: #B8860B; margin-top: 0; font-size: 24px; }
            p { color: rgba(255,255,255,0.7); line-height: 1.6; font-size: 14px; }
            .box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; margin: 16px 0; text-align: left; font-size: 14px; }
            .badge { display: inline-block; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
            .badge-ok { background: rgba(16,185,129,0.18); color: #10b981; border: 1px solid rgba(16,185,129,0.4); }
            .badge-warn { background: rgba(245,158,11,0.18); color: #f59e0b; border: 1px solid rgba(245,158,11,0.4); }
            .btn { display: inline-block; background: linear-gradient(135deg, #B8860B, #c9a84c); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; margin: 6px; border: none; cursor: pointer; font-size: 14px; }
            input { width: 100%; box-sizing: border-box; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; margin-top: 6px; margin-bottom: 12px; }
            label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600; display: block; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ MŞ Group API Sunucusu</h1>
            <div class="badge ${isMysql ? 'badge-ok' : 'badge-warn'}" id="statusBadge">
              ${isMysql ? '🟢 MySQL Veritabanı Aktif (' + dbStatus.database + ')' : '🟡 Yerel Veritabanı Aktif (MySQL Şifresi Bekleniyor)'}
            </div>
            <div class="box">
              <h3 style="margin:0 0 12px 0; color:#B8860B; font-size:15px;">🗄️ Bilgisayarınızdaki MySQL'e Bağlayın</h3>
              <form id="mysqlForm">
                <label>MySQL Kullanıcı Adı</label>
                <input type="text" id="dbUser" value="${dbStatus.user || 'root'}" />
                <label>MySQL Root Şifreniz</label>
                <input type="password" id="dbPass" placeholder="MySQL kurulumunda belirlediğiniz şifre" />
                <label>Veritabanı Adı</label>
                <input type="text" id="dbName" value="${dbStatus.database || 'shahgroup_db'}" />
                <button type="submit" class="btn" style="width:100%; margin:4px 0 0 0;" id="submitBtn">MySQL Veritabanını Kur ve Aktif Et</button>
              </form>
              <div id="msg" style="margin-top:10px; font-size:13px;"></div>
            </div>
            <a class="btn" href="${frontendUrl}">🌐 Web Sitesini Aç</a>
            <a class="btn" href="${frontendUrl}/admin/login">🔐 Yönetim Paneli</a>
          </div>
          <script>
            document.getElementById('mysqlForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              const btn = document.getElementById('submitBtn');
              const msg = document.getElementById('msg');
              btn.disabled = true;
              btn.textContent = 'Bağlanıyor ve tablolar kuruluyor...';
              msg.textContent = '';
              try {
                const res = await fetch('/api/settings/mysql-connect', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    user: document.getElementById('dbUser').value,
                    password: document.getElementById('dbPass').value,
                    database: document.getElementById('dbName').value,
                  })
                });
                const data = await res.json();
                if (res.ok) {
                  msg.style.color = '#10b981';
                  msg.textContent = '✅ ' + data.message;
                  const badge = document.getElementById('statusBadge');
                  badge.className = 'badge badge-ok';
                  badge.textContent = '🟢 MySQL Veritabanı Aktif (' + data.state.database + ')';
                } else {
                  msg.style.color = '#ef4444';
                  msg.textContent = '❌ ' + (data.error || 'Bağlantı hatası');
                }
              } catch (err) {
                msg.style.color = '#ef4444';
                msg.textContent = '❌ Sunucu hatası: ' + err.message;
              } finally {
                btn.disabled = false;
                btn.textContent = 'MySQL Veritabanını Kur ve Aktif Et';
              }
            });
          </script>
        </body>
      </html>
    `);
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Sunucu hatası',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ MŞ Group API sunucusu port ${PORT}'de çalışıyor`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = app;
