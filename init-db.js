const db = require('./config/db.config');

const createContactsTable = `
  CREATE TABLE IF NOT EXISTS Contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    recaptcha_passed INTEGER NOT NULL DEFAULT 0,
    accepted_terms INTEGER NOT NULL DEFAULT 0
  );
`;

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`;

// Ejecutar creación de tablas
db.run(createContactsTable, (err) => {
  if (err) {
    return console.error('❌ Error al crear tabla Contacts:', err.message);
  }
  console.log('✅ Tabla Contacts creada');
});

db.run(createUsersTable, (err) => {
  if (err) {
    return console.error('❌ Error al crear tabla users:', err.message);
  }
  console.log('✅ Tabla users creada');
});
