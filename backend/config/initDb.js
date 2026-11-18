const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('./database');
const processLogo = require('./processLogo');
const syncWorkspaceMedia = require('./syncMedia');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_FILE = path.join(__dirname, '..', 'database', 'local_db.json');
const ENV_FILE = path.join(__dirname, '..', '.env');

let currentDbState = {
  mode: 'local', // 'mysql' | 'local'
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'mskalip',
  lastError: null,
};

async function tryConnectWithPasswords() {
  const configuredPassword = process.env.DB_PASSWORD || 'Mahmut.21';
  const candidates = configuredPassword
    ? [configuredPassword, 'Mahmut.21', '']
    : ['Mahmut.21', ''];

  for (const pwd of candidates) {
    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: pwd,
        multipleStatements: true,
        charset: 'utf8mb4',
        connectTimeout: 2000,
      });
      return { conn, password: pwd };
    } catch (err) {
      currentDbState.lastError = err.message;
    }
  }
  return null;
}

async function seedMySQLFromLocalJson(connection) {
  if (!fs.existsSync(DB_FILE)) return;
  const localData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  // 1. Seed Projects if empty
  const [[{ projCount }]] = await connection.query('SELECT COUNT(*) as projCount FROM projects');
  if (projCount === 0 && Array.isArray(localData.projects) && localData.projects.length > 0) {
    for (const p of localData.projects) {
      await connection.query(
        `INSERT INTO projects (id, category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), short_description = VALUES(short_description)`,
        [
          p.id,
          p.category_id || 1,
          p.title,
          p.slug,
          p.description,
          p.short_description,
          p.location || 'Türkiye',
          p.area || 0,
          p.year || 2025,
          p.status || 'tamamlandi',
          p.is_featured ? 1 : 0,
          p.sort_order || 0,
          p.is_active !== undefined ? (p.is_active ? 1 : 0) : 1,
        ]
      );
    }
  }

  // 2. Seed Media (148 photos + 14 videos) if empty
  const [[{ mediaCount }]] = await connection.query('SELECT COUNT(*) as mediaCount FROM media');
  if (mediaCount === 0 && Array.isArray(localData.media) && localData.media.length > 0) {
    for (const m of localData.media) {
      await connection.query(
        `INSERT INTO media (id, project_id, file_name, original_name, file_path, thumbnail_path, file_type, mime_type, is_cover, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), is_cover = VALUES(is_cover)`,
        [
          m.id,
          m.project_id || null,
          m.file_name,
          m.original_name,
          m.file_path,
          m.thumbnail_path || null,
          m.file_type || 'image',
          m.mime_type || (m.file_type === 'video' ? 'video/mp4' : 'image/jpeg'),
          m.is_cover ? 1 : 0,
          m.sort_order || 0,
        ]
      );
    }
  }
}

async function setupMySQLDatabase(conn, config) {
  const dbName = config.database || process.env.DB_NAME || 'mskalip';

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE \`${dbName}\`;`
  );

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await conn.query(sql);
  }

  const [admins] = await conn.query('SELECT * FROM admins WHERE username = ?', ['admin']);
  const defaultHash = await bcrypt.hash('Admin123!', 10);

  if (admins.length === 0) {
    await conn.query(
      'INSERT INTO admins (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin', 'admin@shahgroup.com', defaultHash, 'Sistem Yöneticisi', 'super_admin']
    );
  } else if (admins[0].password === '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') {
    await conn.query('UPDATE admins SET password = ? WHERE id = ?', [defaultHash, admins[0].id]);
  }

  // Tüm 6 projeyi ve 162 medya dosyasını (148 fotoğraf + 14 video) MySQL'e aktar
  await seedMySQLFromLocalJson(conn);

  // MySQL içindeki marka ayarlarını MŞ Group olarak güncelle ve mükerrer stats kayıtlarını temizle
  await conn.query(`DELETE FROM stats WHERE id > 4`);
  await conn.query(
    `UPDATE settings SET setting_value = 'MŞ Group İnşaat Mimarlık' WHERE setting_key IN ('site_title', 'company_name') AND setting_value LIKE '%Şah Group%'`
  );
  await conn.query(
    `UPDATE settings SET setting_value = 'info@msgroup.com' WHERE setting_key = 'company_email' AND setting_value = 'info@shahgroup.com'`
  );

  const newPool = mysql.createPool({
    host: config.host || 'localhost',
    port: Number(config.port) || 3306,
    user: config.user || 'root',
    password: config.password,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });

  db.setPool(newPool);
  currentDbState = {
    mode: 'mysql',
    host: config.host || 'localhost',
    port: Number(config.port) || 3306,
    user: config.user || 'root',
    database: dbName,
    lastError: null,
  };
}

function updateEnvFile(updates) {
  try {
    let content = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8') : '';
    for (const [key, val] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${val}`);
      } else {
        content += `\n${key}=${val}`;
      }
      process.env[key] = String(val);
    }
    fs.writeFileSync(ENV_FILE, content, 'utf8');
  } catch (err) {
    console.error('.env güncelleme hatası:', err.message);
  }
}

async function connectAndSetupMySQL({ host = 'localhost', port = 3306, user = 'root', password = '', database = 'mskalip' }) {
  let conn;
  try {
    conn = await mysql.createConnection({
      host,
      port: Number(port) || 3306,
      user,
      password,
      multipleStatements: true,
      charset: 'utf8mb4',
    });

    await setupMySQLDatabase(conn, { host, port, user, password, database });
    updateEnvFile({
      DB_HOST: host,
      DB_PORT: port,
      DB_USER: user,
      DB_PASSWORD: password,
      DB_NAME: database,
    });

    return {
      success: true,
      message: `MySQL (${database}) veritabanı başarıyla kuruldu ve tüm projeler/medyalar aktarıldı!`,
      state: currentDbState,
    };
  } catch (err) {
    currentDbState.lastError = err.message;
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

function getDbStatus() {
  return currentDbState;
}

async function initDatabase() {
  syncWorkspaceMedia();
  await processLogo();
  let connection;
  try {
    const result = await tryConnectWithPasswords();
    if (!result) {
      db.enableLocalFallback();
      currentDbState.mode = 'local';
      console.log('ℹ️  MySQL şifresi eşleşmediği için yerel veritabanı (backend/database/local_db.json) kullanılıyor.');
      console.log('💡 MySQL kullanmak için Admin Paneli -> Site Ayarları ekranından veya backend/.env içinden MySQL şifrenizi girebilirsiniz.');
      return;
    }

    connection = result.conn;
    await setupMySQLDatabase(connection, {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: result.password,
      database: process.env.DB_NAME || 'mskalip',
    });

    console.log('✅ MySQL (mskalip) veritabanına bağlandı, tablolar ve 162 medya dosyası hazır!');
  } catch (err) {
    db.enableLocalFallback();
    currentDbState.mode = 'local';
    currentDbState.lastError = err.message;
    console.log('ℹ️  Yerel veritabanı (backend/database/local_db.json) aktif edildi.');
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase.connectAndSetupMySQL = connectAndSetupMySQL;
initDatabase.getDbStatus = getDbStatus;

module.exports = initDatabase;
