const db = require('../config/db.config');
const axios = require('axios');

//const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

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
          secret: '6LehcHUrAAAAAFfkIKLhdTfgsVS3E0yOittUhp0A',
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(403).json({ error: 'reCAPTCHA no aprobado' });
    }

    // Insertar en SQLite
    const query = `
      INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [name, email, message, 1, acceptedTerms ? 1 : 0], function (err) {
      if (err) {
        console.error('Error al guardar contacto:', err.message);
        return res.status(500).json({ error: 'Error al guardar contacto' });
      }
      res.status(201).json({ message: 'Contacto guardado exitosamente', id: this.lastID });
    });
  } catch (error) {
    console.error('Error al procesar contacto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getContacts = (req, res) => {
  db.all('SELECT * FROM Contacts ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error al obtener contactos:', err.message);
      return res.status(500).json({ error: 'Error al obtener contactos' });
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  createContact,
  getContacts,
};
