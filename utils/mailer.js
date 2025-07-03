
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gaelsanchez509@gmail.com',
    pass: 'ecvnraawbydiggeq'
  },
});


module.exports = transporter;



// console.log('📩 Configuración de correo:', {
//   user: process.env.MAIL_USER,
//   pass: process.env.MAIL_PASS ? 'CARGADA' : 'FALTA',
// });


module.exports = transporter;
