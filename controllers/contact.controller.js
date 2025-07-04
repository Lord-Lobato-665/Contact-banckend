const db = require('../config/db.config');
const { App } = require('@slack/bolt');
require('dotenv').config(); // Asegúrate de que esté aquí

// Slack config desde .env
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  const sql = `
    INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, message, 1, 1], async function (err) {
    if (err) {
      console.error('❌ Error al guardar el contacto:', err.message);
      return res.status(500).json({ error: 'Error al guardar el contacto' });
    }

    console.log('✅ Contacto guardado en SQLite');

    // ➤ Enviar a Slack
    try {
      const response = await slackApp.client.chat.postMessage({
        channel: SLACK_CHANNEL_ID,
        text: `📩 *Nuevo contacto recibido:*\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`,
      });

      console.log('✅ Mensaje enviado a Slack', response);
    } catch (error) {
      console.error('❌ Error al enviar mensaje a Slack:', error.data || error.message);
    }

    res.status(201).json({ message: 'Contacto guardado y enviado a Slack' });
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
