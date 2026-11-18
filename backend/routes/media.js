const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
let sharp = null;
try {
  sharp = require('sharp');
} catch {}
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Medya yükle
router.post('/upload', authenticateToken, upload.array('files', 50), async (req, res) => {
  try {
    const { project_id } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith('video/');
      let filePath = file.path.replace(/\\/g, '/');
      let thumbnailPath = null;
      let width = null;
      let height = null;

      if (!isVideo) {
        // Görüntüyü optimize et ve thumbnail oluştur
        const imageDir = 'uploads/images';
        const thumbDir = 'uploads/thumbnails';
        
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
        if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

        const fileName = path.basename(file.filename, path.extname(file.filename));
        const optimizedPath = `${imageDir}/${fileName}.webp`;
        const thumbPath = `${thumbDir}/${fileName}_thumb.webp`;

        try {
          const metadata = await sharp(file.path).metadata();
          width = metadata.width;
          height = metadata.height;

          // Optimize et
          await sharp(file.path)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(optimizedPath);

          // Thumbnail
          await sharp(file.path)
            .resize(400, 300, { fit: 'cover' })
            .webp({ quality: 75 })
            .toFile(thumbPath);

          // Orijinal temp dosyayı sil
          fs.unlinkSync(file.path);
          
          filePath = optimizedPath;
          thumbnailPath = thumbPath;

          // Frontend public/uploads klasörüne de kopyala
          try {
            const frontImgDir = path.join(__dirname, '..', '..', 'frontend', 'public', imageDir);
            const frontThumbDir = path.join(__dirname, '..', '..', 'frontend', 'public', thumbDir);
            fs.mkdirSync(frontImgDir, { recursive: true });
            fs.mkdirSync(frontThumbDir, { recursive: true });
            fs.copyFileSync(optimizedPath, path.join(frontImgDir, path.basename(optimizedPath)));
            fs.copyFileSync(thumbPath, path.join(frontThumbDir, path.basename(thumbPath)));
          } catch {}
        } catch (sharpErr) {
          console.error('Sharp hatası:', sharpErr);
          filePath = file.path;
        }
      } else {
        try {
          const frontVidDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'videos');
          fs.mkdirSync(frontVidDir, { recursive: true });
          fs.copyFileSync(file.path, path.join(frontVidDir, path.basename(filePath)));
        } catch {}
      }

      const [result] = await db.query(
        `INSERT INTO media (project_id, file_name, original_name, file_path, thumbnail_path, file_type, mime_type, file_size, width, height)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project_id || null,
          path.basename(filePath),
          file.originalname,
          filePath,
          thumbnailPath,
          isVideo ? 'video' : 'image',
          file.mimetype,
          file.size,
          width,
          height
        ]
      );

      uploadedFiles.push({
        id: result.insertId,
        file_path: filePath,
        thumbnail_path: thumbnailPath,
        file_type: isVideo ? 'video' : 'image',
        original_name: file.originalname
      });
    }

    res.json({ success: true, files: uploadedFiles, message: `${uploadedFiles.length} dosya yüklendi` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Dosya yükleme hatası: ' + err.message });
  }
});

// Projeye ait medyaları getir
router.get('/project/:projectId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM media WHERE project_id = ? ORDER BY is_cover DESC, sort_order ASC',
      [req.params.projectId]
    );
    res.json({ media: rows });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tüm medyaları getir (public ve admin)
router.get('/', async (req, res) => {
  try {
    const { type, project_id, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let where = [];
    let params = [];
    
    if (type) { where.push('m.file_type = ?'); params.push(type); }
    if (project_id) { where.push('m.project_id = ?'); params.push(project_id); }
    
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const [rows] = await db.query(
      `SELECT m.*, p.title as project_title FROM media m
       LEFT JOIN projects p ON m.project_id = p.id
       ${whereStr} ORDER BY m.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM media m ${whereStr}`,
      params
    );
    
    res.json({ media: rows, total });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kapak fotoğrafı ayarla
router.put('/:id/cover', authenticateToken, async (req, res) => {
  try {
    const media = await db.query('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if (media[0].length === 0) return res.status(404).json({ error: 'Medya bulunamadı' });
    
    const { project_id } = media[0][0];
    await db.query('UPDATE media SET is_cover = 0 WHERE project_id = ?', [project_id]);
    await db.query('UPDATE media SET is_cover = 1 WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, message: 'Kapak fotoğrafı güncellendi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Projeye ata
router.put('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { project_id } = req.body;
    await db.query('UPDATE media SET project_id = ? WHERE id = ?', [project_id, req.params.id]);
    res.json({ success: true, message: 'Medya projeye atandı' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Medya sil
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Medya bulunamadı' });
    
    const media = rows[0];
    
    // Dosyaları sil
    if (media.file_path && fs.existsSync(media.file_path)) {
      fs.unlinkSync(media.file_path);
    }
    if (media.thumbnail_path && fs.existsSync(media.thumbnail_path)) {
      fs.unlinkSync(media.thumbnail_path);
    }
    
    await db.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Medya silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
