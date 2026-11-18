const mysql = require('mysql2/promise');
const { executeLocalQuery, loadStore } = require('./localStore');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let pool = null;
// Başlangıçta MySQL bağlantısı doğrulanana kadar yerel JSON veritabanı aktif olsun (503 / bağlantı hatasını önler)
let useLocalStore = true;

const db = {
  async query(sql, params = []) {
      if (useLocalStore || !pool) {
        return executeLocalQuery(sql, params);
      }
      try {
        return await pool.query(sql, params);
      } catch (err) {
        if (
          err.code === 'ER_ACCESS_DENIED_ERROR' ||
          err.code === 'ECONNREFUSED' ||
          err.code === 'ER_BAD_DB_ERROR' ||
        err.code === 'PROTOCOL_CONNECTION_LOST' ||
            err.code === 'ETIMEDOUT'
      ) {
  if (!useLocalStore) {
    useLocalStore = true;
    loadStore();
    console.log('📂 MySQL yerine yerel veritabanı (database/local_db.json) aktif edildi.');
  }
  return executeLocalQuery(sql, params);
}
throw err;
    }
  },
setPool(newPool) {
  pool = newPool;
  useLocalStore = false;
},
enableLocalFallback() {
  useLocalStore = true;
  loadStore();
},
};

module.exports = db;
