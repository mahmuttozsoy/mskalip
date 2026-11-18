const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const MEDIA_ARCHIVE_DIR = path.join(ROOT_DIR, 'medya');
const BACKEND_UPLOADS = path.join(__dirname, '..', 'uploads');
const FRONTEND_UPLOADS = path.join(ROOT_DIR, 'frontend', 'public', 'uploads');
const DB_FILE = path.join(__dirname, '..', 'database', 'local_db.json');

function ensureDirs() {
  const dirs = [
    MEDIA_ARCHIVE_DIR,
    path.join(BACKEND_UPLOADS, 'images'),
    path.join(BACKEND_UPLOADS, 'videos'),
    path.join(FRONTEND_UPLOADS, 'images'),
    path.join(FRONTEND_UPLOADS, 'videos'),
    path.dirname(DB_FILE),
  ];
  for (const d of dirs) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
}

function moveRootMediaIntoFolder() {
  try {
    const rootEntries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    for (const entry of rootEntries) {
      if (!entry.isFile()) continue;
      if (/\.(jpe?g|png|webp|mp4|mov|avi|webm)$/i.test(entry.name)) {
        const srcPath = path.join(ROOT_DIR, entry.name);
        const destPath = path.join(MEDIA_ARCHIVE_DIR, entry.name);
        try {
          if (!fs.existsSync(destPath)) {
            fs.renameSync(srcPath, destPath);
          } else {
            fs.unlinkSync(srcPath);
          }
        } catch {
          try {
            fs.copyFileSync(srcPath, destPath);
            fs.unlinkSync(srcPath);
          } catch {}
        }
      }
    }
  } catch (err) {
    console.error('Medya taşıma hatası:', err.message);
  }
}

function copyIfMissing(src, dst) {
  try {
    if (!fs.existsSync(dst)) {
      fs.copyFileSync(src, dst);
    }
  } catch (err) {
    console.error('Dosya kopyalama hatası:', err.message);
  }
}

function syncWorkspaceMedia() {
  try {
    ensureDirs();

    // Ana dizindeki dağınık fotoğraf ve videoları "medya/" klasöründe topla
    moveRootMediaIntoFolder();

    const entries = fs.readdirSync(MEDIA_ARCHIVE_DIR, { withFileTypes: true });
    const imageFiles = entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp)$/i.test(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'tr'));

    const videoFiles = entries
      .filter((e) => e.isFile() && /\.(mp4|mov|avi|webm)$/i.test(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'tr'));

    if (imageFiles.length === 0 && videoFiles.length === 0) return;

    const now = new Date().toISOString();

    const preferredCovers = {
      1: 'WhatsApp Image 2026-10-29 at 20.59.40.jpeg',
      2: 'WhatsApp Image 2026-10-29 at 21.02.48.jpeg',
      3: 'WhatsApp Image 2026-10-29 at 21.00.18.jpeg',
      4: 'WhatsApp Image 2026-10-29 at 20.58.32.jpeg',
      5: 'WhatsApp Image 2026-10-29 at 21.00.21.jpeg',
      6: 'WhatsApp Image 2026-10-29 at 21.11.35.jpeg',
    };

    const projects = [
      {
        id: 1,
        category_id: 1,
        title: 'Toplu Konut & Betonarme Yapı Kompleksi',
        slug: 'toplu-konut-betonarme-yapi-kompleksi',
        description:
          'Deprem yönetmeliğine tam uyumlu, yüksek dayanımlı betonarme taşıyıcı sistem ve modern kalıp teknolojileriyle inşa edilen çok bloklu konut ve yaşam projemiz. Saha dökümleri, perde beton imalatları ve üst yapı uygulamaları uzman mühendis kadromuz kontrolünde tamamlanmıştır.',
        short_description: 'Depreme dayanıklı betonarme taşıyıcı sistemli çok bloklu toplu konut projesi.',
        location: 'Türkiye',
        area: 18500,
        year: 2025,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 1,
        is_active: 1,
        created_at: now,
      },
      {
        id: 2,
        category_id: 6,
        title: 'Yüksek İstinat Duvarı & Perde Beton Projesi',
        slug: 'yuksek-istinat-duvari-perde-beton-projesi',
        description:
          'Yüksek kot farklarına sahip arazilerde zemin güvenliğini sağlamak amacıyla projelendirilen ağır hizmet tipi betonarme istinat duvarı ve perde beton imalatları. Çelik yüzeyli endüstriyel kalıp sistemleri ile pürüzsüz brüt beton yüzey kalitesi elde edilmiştir.',
        short_description: 'Endüstriyel kalıp sistemleriyle yüksek dayanımlı brüt beton istinat ve perde duvar uygulaması.',
        location: 'Türkiye',
        area: 9200,
        year: 2025,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 2,
        is_active: 1,
        created_at: now,
      },
      {
        id: 3,
        category_id: 6,
        title: 'Ağır Demir Donatı & Radye Temel Uygulaması',
        slug: 'agir-demir-donati-radye-temel-uygulamasi',
        description:
          'Büyük ölçekli üstyapı ve mühendislik yapıları için yüksek yoğunluklu nervürlü çelik donatı işçiliği, temel kirişleri ve radye temel beton döküm çalışmaları. Statik projeye birebir uygunluk ve maksimum mukavemet standartlarında uygulanmıştır.',
        short_description: 'Yüksek yoğunluklu çelik donatı ve radye temel mühendislik uygulaması.',
        location: 'Türkiye',
        area: 14000,
        year: 2025,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 3,
        is_active: 1,
        created_at: now,
      },
      {
        id: 4,
        category_id: 2,
        title: 'Endüstriyel Tesis & Fabrika Temel İnşaatı',
        slug: 'endustriyel-tesis-fabrika-temel-insaati',
        description:
          'Ağır makine yüklerine ve endüstriyel operasyonlara dayanıklı fabrika içi makine temelleri, derin temel çukuru donatı imalatları ve yüksek mukavemetli endüstriyel saha betonu uygulamaları.',
        short_description: 'Ağır yük taşıma kapasiteli endüstriyel tesis ve makine temeli inşaatı.',
        location: 'Türkiye',
        area: 11500,
        year: 2025,
        status: 'devam_ediyor',
        is_featured: 1,
        sort_order: 4,
        is_active: 1,
        created_at: now,
      },
      {
        id: 5,
        category_id: 7,
        title: 'Altyapı Galerisi & Tünel Kalıp Sistemi',
        slug: 'altyapi-galerisi-tunel-kalip-sistemi',
        description:
          'Uzun metrajlı altyapı hatları, betonarme galeri kanalları ve çevre düzenleme kapsamında gerçekleştirilen kazı, grobeton, demir donatı ve modüler kalıp imalatları.',
        short_description: 'Uzun metrajlı betonarme altyapı galerisi, kanal ve saha mühendisliği projesi.',
        location: 'Türkiye',
        area: 16800,
        year: 2025,
        status: 'devam_ediyor',
        is_featured: 1,
        sort_order: 5,
        is_active: 1,
        created_at: now,
      },
      {
        id: 6,
        category_id: 1,
        title: 'Anahtar Teslim Betonarme & Saha Uygulamaları',
        slug: 'anahtar-teslim-betonarme-saha-uygulamalari',
        description:
          'Vinç destekli ağır kalıp montajı, gece ve gündüz kesintisiz pompa beton dökümleri, kolon-perde imalatları ve anahtar teslim şantiye yönetimi çalışmalarımız.',
        short_description: 'Vinç destekli modüler kalıp montajı ve anahtar teslim betonarme saha uygulamaları.',
        location: 'Türkiye',
        area: 12400,
        year: 2024,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 6,
        is_active: 1,
        created_at: now,
      },
    ];

    const media = [];
    let mediaId = 1;

    imageFiles.forEach((origName, idx) => {
      const num = String(idx + 1).padStart(3, '0');
      const fileName = `sah-photo-${num}.jpg`;
      const relPath = `uploads/images/${fileName}`;

      const srcFile = path.join(MEDIA_ARCHIVE_DIR, origName);
      copyIfMissing(srcFile, path.join(BACKEND_UPLOADS, 'images', fileName));
      copyIfMissing(srcFile, path.join(FRONTEND_UPLOADS, 'images', fileName));

      let assignedProject = (idx % 6) + 1;
      let isCover = 0;
      for (const [pId, coverOrig] of Object.entries(preferredCovers)) {
        if (origName === coverOrig) {
          assignedProject = Number(pId);
          isCover = 1;
          break;
        }
      }

      const projectTitle = projects.find((p) => p.id === assignedProject)?.title || 'Şah Group Saha Çalışması';

      media.push({
        id: mediaId++,
        project_id: assignedProject,
        file_name: fileName,
        original_name: `${projectTitle} - Fotoğraf #${idx + 1}`,
        file_path: relPath,
        thumbnail_path: relPath,
        file_type: 'image',
        mime_type: 'image/jpeg',
        is_cover: isCover,
        sort_order: isCover ? 0 : idx + 1,
        created_at: now,
      });
    });

    videoFiles.forEach((origName, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const fileName = `sah-video-${num}.mp4`;
      const relPath = `uploads/videos/${fileName}`;

      const srcFile = path.join(MEDIA_ARCHIVE_DIR, origName);
      copyIfMissing(srcFile, path.join(BACKEND_UPLOADS, 'videos', fileName));
      copyIfMissing(srcFile, path.join(FRONTEND_UPLOADS, 'videos', fileName));

      const assignedProject = (idx % 6) + 1;
      const projectTitle = projects.find((p) => p.id === assignedProject)?.title || 'Şah Group Şantiye Videosu';

      media.push({
        id: mediaId++,
        project_id: assignedProject,
        file_name: fileName,
        original_name: `${projectTitle} - Saha Videosu #${idx + 1}`,
        file_path: relPath,
        thumbnail_path: null,
        file_type: 'video',
        mime_type: 'video/mp4',
        is_cover: 0,
        sort_order: idx + 1,
        created_at: now,
      });
    });

    let storeData = {};
    if (fs.existsSync(DB_FILE)) {
      try {
        storeData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      } catch {
        storeData = {};
      }
    }

    const existingProjects = Array.isArray(storeData.projects) ? storeData.projects : [];
    const existingMedia = Array.isArray(storeData.media) ? storeData.media : [];
    const hasOldSeed =
      existingProjects.length < 6 ||
      existingProjects.some((p) => p.slug === 'sah-vadi-konaklari') ||
      existingMedia.length < 50;

    // Marka adını MŞ Group olarak güncelle
    if (Array.isArray(storeData.settings)) {
      let settingsUpdated = false;
      for (const s of storeData.settings) {
        if ((s.setting_key === 'site_title' || s.setting_key === 'company_name') && s.setting_value?.includes('Şah Group')) {
          s.setting_value = 'MŞ Group İnşaat Mimarlık';
          settingsUpdated = true;
        }
        if (s.setting_key === 'company_email' && s.setting_value === 'info@shahgroup.com') {
          s.setting_value = 'info@msgroup.com';
          settingsUpdated = true;
        }
      }
      if (settingsUpdated && !hasOldSeed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(storeData, null, 2), 'utf8');
      }
    }

    if (hasOldSeed) {
      storeData.projects = projects;
      storeData.media = media;
      fs.writeFileSync(DB_FILE, JSON.stringify(storeData, null, 2), 'utf8');
      console.log(`✅ Tüm fotoğraf (${imageFiles.length}) ve videolar (${videoFiles.length}) 'medya/' klasöründe toplandı ve sisteme yüklendi.`);
    } else {
      // Sadece yeni eklenen medya dosyaları varsa mevcut verileri koruyarak ekle
      const existingPaths = new Set(existingMedia.map((m) => m.file_path));
      let maxId = existingMedia.reduce((max, m) => Math.max(max, Number(m.id) || 0), 0);
      let addedCount = 0;
      for (const m of media) {
        if (!existingPaths.has(m.file_path)) {
          storeData.media.push({ ...m, id: ++maxId });
          addedCount++;
        }
      }
      if (addedCount > 0) {
        fs.writeFileSync(DB_FILE, JSON.stringify(storeData, null, 2), 'utf8');
        console.log(`✅ ${addedCount} yeni medya dosyası 'medya/' klasöründen sisteme eklendi.`);
      }
    }
  } catch (err) {
    console.error('Medya senkronizasyon hatası:', err.message);
  }
}

module.exports = syncWorkspaceMedia;
