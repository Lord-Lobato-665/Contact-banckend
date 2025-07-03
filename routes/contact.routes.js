const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contact.controller');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Guarda un mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contacto guardado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Obtener todos los contactos
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contactos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   message:
 *                     type: string
 *       500:
 *         description: Error al obtener los contactos
 */
router.post('/contact', createContact);

const { authMiddleware } = require('../middleware/auth.middleware');
router.get('/contact', authMiddleware, getContacts);


module.exports = router;
