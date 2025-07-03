
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail service
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // contraseña de aplicación
  },
});

module.exports = transporter;



// console.log('📩 Configuración de correo:', {
//   user: process.env.MAIL_USER,
//   pass: process.env.MAIL_PASS ? 'CARGADA' : 'FALTA',
// });


module.exports = transporter;
