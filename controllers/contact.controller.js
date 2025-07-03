const db = require('../config/db.config');
const axios = require('axios');

const createContact = async (req, res) => {
  try {
    const { name, email, message, recaptchaToken, acceptedTerms } = req.body;

    console.log('📝 Body recibido:', req.body);

    // Validación de campos obligatorios
    if (!name || !email || !message || !recaptchaToken) {
      console.warn('⚠️ Faltan campos requeridos');
      return res.status(400).json({ error: 'Faltan campos obligatorios (name, email, message, recaptchaToken)' });
    }

    if (!acceptedTerms) {
      console.warn('⚠️ Términos no aceptados');
      return res.status(400).json({ error: 'Debe aceptar los términos y condiciones' });
    }

    // Validar reCAPTCHA con Google
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: '6LfGkHUrAAAAAJGNfAZpet92umhpk-E4Kx5jpafo',
          response: recaptchaToken,
        },
      }
    );

    console.log('🛡️ Resultado reCAPTCHA:', recaptchaResponse.data);

    if (!recaptchaResponse.data.success) {
      return res.status(403).json({ error: 'reCAPTCHA no aprobado' });
    }

    // Inserción en SQLite
    const query = `
      INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [name, email, message, 1, 1], function (err) {
      if (err) {
        console.error('❌ Error al guardar contacto:', err.message);
        return res.status(500).json({ error: 'Error al guardar contacto en la base de datos' });
      }

      console.log('✅ Contacto guardado con ID:', this.lastID);
      res.status(201).json({ message: 'Contacto guardado exitosamente', id: this.lastID });
    });
  } catch (error) {
    console.error('💥 Error inesperado:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getContacts = (req, res) => {
  db.all('SELECT * FROM Contacts ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener contactos:', err.message);
      return res.status(500).json({ error: 'Error al obtener contactos' });
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  createContact,
  getContacts,
};
