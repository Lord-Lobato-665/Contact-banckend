const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar a SQLite:', err.message);
    process.exit(1);
  } else {
    console.log('🔌 Conectado a SQLite');
  }
});

module.exports = db;
