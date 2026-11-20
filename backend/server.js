const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const initDatabase = require('./config/initDb');
const db = require('./config/database');
const PERSISTENT_UPLOADS = path.join(process.env.PERSISTENT_DATA_DIR || path.join(os.homedir(), '.msgroup_data'), 'uploads');

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

// Statik dosyalar (kalıcı sunucu dizini, backend/uploads, frontend/public/uploads ve frontend/dist/uploads)
app.use('/uploads', express.static(PERSISTENT_UPLOADS));
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

// Dinamik robots.txt (Google SEO)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api/auth',
      '',
      'Sitemap: https://mskalip.com/sitemap.xml',
    ].join('\n')
  );
});

// Dinamik sitemap.xml (Admin panelinden eklenen tüm projeleri otomatik içerir)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://mskalip.com';
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/projeler', changefreq: 'weekly', priority: '0.9' },
      { url: '/hizmetler', changefreq: 'weekly', priority: '0.9' },
      { url: '/hakkimizda', changefreq: 'monthly', priority: '0.8' },
      { url: '/galeri', changefreq: 'weekly', priority: '0.8' },
      { url: '/iletisim', changefreq: 'monthly', priority: '0.8' },
    ];

    let projectRows = [];
    try {
      const [rows] = await db.query('SELECT slug, created_at FROM projects WHERE is_active = 1');
      projectRows = Array.isArray(rows) ? rows : [];
    } catch {}

    const today = new Date().toISOString().split('T')[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const p of staticPages) {
      xml += `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }

    for (const proj of projectRows) {
      if (!proj.slug) continue;
      xml += `  <url>\n    <loc>${baseUrl}/projeler/${proj.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch {
    res.status(500).end();
  }
});

// Canlı (Production) modda frontend/dist varsa doğrudan sun
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

const ROUTE_SEO_META = {
  '/projeler': {
    title: 'Çelik Kalıp & Betonarme Projelerimiz | Mustafa Şahin — MŞ Group İnşaat (MŞ Kalıp)',
    desc: 'Mustafa Şahin öncülüğündeki MŞ Group İnşaat & Mimarlık (MŞ Kalıp) tarafından çelik kalıp sistemleriyle tamamlanan ve devam eden toplu konut, yüksek istinat duvarı, perde beton, radye temel ve endüstriyel tesis projeleri.',
  },
  '/hizmetler': {
    title: 'Çelik Kalıp Sistemleri & Betonarme İnşaat Hizmetlerimiz | MŞ Kalıp — Mustafa Şahin',
    desc: 'Mustafa Şahin — MŞ Group İnşaat (MŞ Kalıp): Endüstriyel çelik kalıp sistemleri, perde ve kolon çelik kalıp uygulamaları, tünel kalıp, betonarme kaba inşaat, ağır demir donatı, radye temel ve anahtar teslim inşaat hizmetlerimiz.',
  },
  '/hakkimizda': {
    title: 'Hakkımızda & Vizyonumuz | Mustafa Şahin — MŞ Group İnşaat (MŞ Kalıp)',
    desc: 'Kurucumuz Mustafa Şahin liderliğinde 15 yılı aşkın tecrübemiz, modern çelik kalıp parkurumuz ve uzman mühendis kadromuz ile Türkiye genelinde betonarme, çelik kalıp ve anahtar teslim yapı projeleri üretiyoruz.',
  },
  '/galeri': {
    title: 'Çelik Kalıp & Şantiye Saha Galerisi | Mustafa Şahin — MŞ Group İnşaat (MŞ Kalıp)',
    desc: 'Şantiyelerimizden 148 uygulama fotoğrafı ve 14 saha videosu ile çelik kalıp montajı, perde beton dökümü, vinç operasyonu ve ağır demir donatı çalışmalarımızı inceleyin.',
  },
  '/iletisim': {
    title: 'İletişim & Çelik Kalıp / İnşaat Teklifi | Mustafa Şahin — MŞ Group (+90 536 869 62 51)',
    desc: 'Mustafa Şahin — MŞ Group İnşaat (MŞ Kalıp) ile çelik kalıp uygulamaları, betonarme kaba inşaat ve anahtar teslim projeleriniz için ücretsiz keşif ve fiyat teklifi alın. Tel & WhatsApp: +90 536 869 62 51.',
  },
};

// Tüm /api ve /uploads dışındaki GET isteklerini React SPA (index.html) uygulamasına yönlendir (Googlebot için sayfa bazlı SEO meta etiketleriyle)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const cleanPath = req.path.replace(/\/+$/, '') || '/';
    const seo = ROUTE_SEO_META[cleanPath];
    if (seo) {
      try {
        let html = fs.readFileSync(indexHtml, 'utf8');
        html = html
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="description" content="${seo.desc}" />`
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
            `<link rel="canonical" href="https://mskalip.com${cleanPath}" />`
          );
        return res.send(html);
      } catch {}
    }
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
