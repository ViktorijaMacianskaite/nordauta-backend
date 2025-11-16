const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer su paprasta laikina saugykla
const upload = multer({ dest: 'uploads/' });

const { getAllAds, getAdById, createAd, deleteAd } = require('../controllers/adsController');

router.get('/', getAllAds);
router.get('/:id', getAdById);
router.post('/', upload.array('images', 25), createAd);
router.delete('/:id', deleteAd);

module.exports = router;
