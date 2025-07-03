require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS
app.use(cors());

// Body Parser
app.use(bodyParser.json());

// Swagger config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Contacto',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// ✅ Aquí defines la variable options que antes te faltaba
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

// Rutas
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirección raíz
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
