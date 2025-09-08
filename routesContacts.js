const express = require('express');
const router = express.Router();

// importuojam kontrolerį
const { sendContactEmail } = require('../controllers/emailController');

// POST /api/contact
router.post('/contact', sendContactEmail);

module.exports = router;
