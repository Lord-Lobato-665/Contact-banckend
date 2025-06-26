const { poolPromise } = require('../config/db.config');
const axios = require('axios');

// 👉 Clave secreta directa (SOLO para tarea o pruebas)
const RECAPTCHA_SECRET_KEY = '6Lf5yW4rAAAAAEJs8Kjrj3ooxPGciZK83GMY-a8Y';

const createContact = async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  try {
    // Validar reCAPTCHA
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      return res.status(403).json({ error: 'reCAPTCHA no aprobado' });
    }

    // Guardar en la base de datos
    const pool = await poolPromise;

    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('message', message)
      .input('recaptcha_passed', true)
      .query(`
        INSERT INTO Contacts (name, email, message, recaptcha_passed)
        VALUES (@name, @email, @message, @recaptcha_passed)
      `);

    res.status(201).json({ message: 'Contacto guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar contacto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getContacts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Contacts ORDER BY id DESC
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener contactos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createContact,
  getContacts,
};
