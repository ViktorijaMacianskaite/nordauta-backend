// index.js — Nordauta backend (Render)
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ===== Middlewares ===== */
app.use(express.json());

// Leisk užklausas iš tavo fronto domeno
const allowedOrigins = [
  'https://nordauta.lt',
  'https://www.nordauta.lt',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS: origin not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Statiniai įkėlimai (jei naudoji multer -> atmink, kad Render diskas laikinas)
app.use('/uploads', express.static('uploads'));

/* ===== Routes ===== */
// Healthcheck
app.get('/api/hello', (_, res) => res.json({ ok: true }));

// Skelbimai (jei turi)
const adsRouter = require(path.join(__dirname, 'routes', 'ads.js'));
app.use('/api/ads', adsRouter);

// Kontaktų/pašto maršrutai (paliekam tavo pavadinimą)
const contactRoutes = require(path.join(__dirname, 'routes', 'routesContacts.js'));
app.use('/api', contactRoutes);

/* ===== DB ===== */
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Prisijungta prie MongoDB'))
    .catch(err => console.error('MongoDB klaida:', err));

/* ===== Start ===== */
const PORT = process.env.PORT || 10000; // Render paduoda PORT
app.listen(PORT, () => {
    console.log('API on :' + PORT);
});
