const db = require('./config/db.config');

const createTable = `
  CREATE TABLE IF NOT EXISTS Contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    recaptcha_passed INTEGER NOT NULL DEFAULT 0,
    accepted_terms INTEGER NOT NULL DEFAULT 0
  );
`;

db.run(createTable, (err) => {
  if (err) {
    return console.error('❌ Error al crear tabla:', err.message);
  }
  console.log('✅ Tabla Contacts creada');
});
