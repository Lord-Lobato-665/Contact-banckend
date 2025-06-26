const { poolPromise } = require('../config/db.config');
const axios = require('axios');

// Clave secreta directa para la tarea
const RECAPTCHA_SECRET_KEY = '6Lf5yW4rAAAAAEJs8Kjrj3ooxPGciZK83GMY-a8Y';

const createContact = async (req, res) => {
  const { name, email, message, recaptchaToken, acceptedTerms } = req.body;

  if (!acceptedTerms) {
    return res.status(400).json({ error: 'Debe aceptar los términos y condiciones' });
  }

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

    if (!response.data.success) {
      return res.status(403).json({ error: 'reCAPTCHA no aprobado' });
    }

    // Guardar en base de datos
    const pool = await poolPromise;

    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('message', message)
      .input('recaptcha_passed', true)
      .input('accepted_terms', acceptedTerms ? 1 : 0)
      .query(`
        INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms)
        VALUES (@name, @email, @message, @recaptcha_passed, @accepted_terms)
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
    const result = await pool.request().query('SELECT * FROM Contacts ORDER BY id DESC');
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
