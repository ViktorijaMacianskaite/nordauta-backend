const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const adsRouter = require('./routes/ads');

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/api/ads', adsRouter);


app.get('/', (req, res) => {
    res.send('Backend ok');
});

const contactRoutes = require('./routes/routesContacts');
app.use('/api', contactRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Prisijungta prie MongoDB'))
    .catch(err => console.error('MongoDB klaida:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveris veikia ant porto ${PORT}`);
});
