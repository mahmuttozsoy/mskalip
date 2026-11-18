const mysql = require('mysql2/promise');
const { executeLocalQuery, loadStore } = require('./localStore');
require('dotenv').config();

let pool = null;
let useLocalStore = false;

function createPool(password) {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: password !== undefined ? password : (process.env.DB_PASSWORD || 'Mahmut.21'),
    database: process.env.DB_NAME || 'mskalip',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });
}

pool = createPool();

const db = {
  async query(sql, params = []) {
    if (useLocalStore) {
      return executeLocalQuery(sql, params);
    }
    try {
      return await pool.query(sql, params);
    } catch (err) {
      if (
        err.code === 'ER_ACCESS_DENIED_ERROR' ||
        err.code === 'ECONNREFUSED' ||
        err.code === 'ER_BAD_DB_ERROR' ||
        err.code === 'PROTOCOL_CONNECTION_LOST'
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
