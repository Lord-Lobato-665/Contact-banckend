// controllers/auth.controller.js
const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta';

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashed], function (err) {
    if (err) return res.status(400).json({ error: 'Usuario ya existe' });
    res.status(201).json({ message: 'Usuario registrado' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
};

exports.getUsers = (req, res) => {
  db.all(`SELECT id, username FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json(rows);
  });
};
