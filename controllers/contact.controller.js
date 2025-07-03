const db = require('../config/db.config');
const transporter = require('../utils/mailer');

const createContact = (req, res) => {
  const { name, email, message } = req.body;

  const sql = `INSERT INTO Contacts (name, email, message, recaptcha_passed, accepted_terms) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, email, message, 1, 1], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar el contacto' });
    }

    const mailOptions = {
  from: `"Formulario Contacto" <${process.env.MAIL_USER}>`,
  to: process.env.MAIL_TO,
  subject: 'Nuevo mensaje de contacto',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <header style="background-color: #2a4d69; color: white; padding: 15px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h2 style="margin: 0; font-weight: 700;">Nuevo mensaje de contacto</h2>
        </header>
        <main style="padding: 20px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
          <p><strong style="color: #1e3a5f;">Nombre:</strong> ${name}</p>
          <p><strong style="color: #1e3a5f;">Email:</strong> ${email}</p>
          <p><strong style="color: #1e3a5f;">Mensaje:</strong></p>
          <p style="background-color: #e9eff5; padding: 15px; border-radius: 6px; color: #2a4d69; white-space: pre-wrap;">${message}</p>
        </main>
        <footer style="background-color: #cbd3da; color: #2a4d69; text-align: center; padding: 10px 20px; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} LobatoCorp. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  `,
};


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Error al enviar correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo' });
      }
      console.log('✅ Correo enviado:', info.response);
      res.status(201).json({ message: 'Contacto guardado y correo enviado' });
    });
  });
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
