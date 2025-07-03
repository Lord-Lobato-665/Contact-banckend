const db = require('./config/db.config');
const bcrypt = require('bcrypt');

const username = 'Lobato';
const password = 'admin1234';
const saltRounds = 10;

const checkUserExists = `SELECT * FROM users WHERE username = ?`;
const insertUser = `INSERT INTO users (username, password) VALUES (?, ?)`;

// Verificar si ya existe el usuario
db.get(checkUserExists, [username], (err, row) => {
  if (err) {
    return console.error('❌ Error al verificar el usuario:', err.message);
  }

  if (row) {
    console.log(`⚠️ El usuario "${username}" ya existe. No se insertó.`);
  } else {
    // Hashear contraseña e insertar usuario
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return console.error('❌ Error al hashear la contraseña:', err.message);
      }

      db.run(insertUser, [username, hashedPassword], (err) => {
        if (err) {
          return console.error('❌ Error al insertar usuario:', err.message);
        }
        console.log(`✅ Usuario "${username}" insertado correctamente.`);
      });
    });
  }
});
