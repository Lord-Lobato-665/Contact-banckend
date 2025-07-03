const db = require('./config/db.config');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const defaultUsername = 'Lobato';
const defaultPassword = 'admin1234';

// Crear tabla Contacts
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

// Crear tabla users
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`;

// Ejecutar creación de tabla Contacts
db.run(createContactsTable, (err) => {
  if (err) {
    console.error('❌ Error al crear tabla Contacts:', err.message);
  } else {
    console.log('✅ Tabla Contacts creada');
  }
});

// Ejecutar creación de tabla users
db.run(createUsersTable, (err) => {
  if (err) {
    console.error('❌ Error al crear tabla users:', err.message);
  } else {
    console.log('✅ Tabla users creada');

    // Verificar si el usuario ya existe
    const checkUserExists = `SELECT * FROM users WHERE username = ?`;
    db.get(checkUserExists, [defaultUsername], (err, row) => {
      if (err) return console.error('❌ Error al verificar usuario:', err.message);

      if (row) {
        console.log('⚠️ El usuario "Lobato" ya existe, no se inserta.');
      } else {
        // Hashear contraseña e insertar usuario
        bcrypt.hash(defaultPassword, saltRounds, (err, hashedPassword) => {
          if (err) return console.error('❌ Error al hashear la contraseña:', err.message);

          const insertUser = `INSERT INTO users (username, password) VALUES (?, ?)`;
          db.run(insertUser, [defaultUsername, hashedPassword], (err) => {
            if (err) return console.error('❌ Error al insertar usuario:', err.message);
            console.log('✅ Usuario "Lobato" insertado con éxito');
          });
        });
      }
    });
  }
});
