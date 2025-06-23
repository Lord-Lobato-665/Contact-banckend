const { poolPromise } = require('../config/db.config');

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('message', message)
      .query('INSERT INTO Contacts (name, email, message) VALUES (@name, @email, @message)');

    res.status(201).json({ message: 'Contacto guardado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Contacts ORDER BY id DESC');
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createContact,
  getContacts,
};
