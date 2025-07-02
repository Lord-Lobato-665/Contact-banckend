const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contact.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

require('dotenv').config()

const app = express();
const PORT = 3000;

// Configuración simple: permite todas las peticiones desde cualquier origen
app.use(cors());

// O configuración más estricta para permitir solo tu frontend
app.use(cors({
  origin: 'http://localhost:5173', // Cambia a la URL donde corre tu frontend Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // si usas cookies o auth que requiere credenciales
}));

// Swagger config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Contacto',
    version: '1.0.0',
  },
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // archivos donde escribiste los comentarios de Swagger
};
const swaggerSpec = swaggerJsdoc(options);

app.use(bodyParser.json());
app.use('/api', contactRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
