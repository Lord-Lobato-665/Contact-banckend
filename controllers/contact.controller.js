const db = require('../config/db.config');
const axios = require('axios');

// Puedes usar process.env.SLACK_WEBHOOK_URL si prefieres moverlo a un .env
const webhookURL = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'; // reemplaza con tu webhook real

const createContact = (req, res) => {
  const { name, email, message } = req.body;

  const sql = `
    INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, message, 1, 1], function (err) {
    if (err) {
      console.error('❌ Error al guardar el contacto:', err.message);
      return res.status(500).json({ error: 'Error al guardar el contacto' });
    }

    console.log('✅ Contacto guardado en la base de datos');

    const slackPayload = {
      text: `📨 *Nuevo contacto recibido*\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`
    };

    axios.post(webhookURL, slackPayload)
      .then(() => {
        console.log('✅ Notificación enviada a Slack');
        res.status(201).json({ message: 'Contacto guardado y notificación enviada' });
      })
      .catch((error) => {
        console.error('❌ Error al enviar a Slack:', error.message);
        res.status(201).json({ message: 'Contacto guardado, pero falló la notificación' });
      });
  });
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
