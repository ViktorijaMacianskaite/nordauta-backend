const Ad = require('../models/Ad');
const fs = require('fs');
const path = require('path');

const getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (err) {
        console.error('Klaida gaunant skelbimus:', err);
        res.status(500).json({ message: 'Nepavyko gauti skelbimų' });
    }
};

const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Skelbimas nerastas' });
        res.json(ad);
    } catch (err) {
        console.error('Klaida gaunant skelbimą:', err);
        res.status(500).json({ message: 'Nepavyko gauti skelbimo' });
    }
};

const createAd = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        let features = {};
        let attributes = {};

        if (req.body.features) {
            features = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
        }

        if (req.body.attributes) {
            attributes = typeof req.body.attributes === 'string' ? JSON.parse(req.body.attributes) : req.body.attributes;
        }

        if (!title || !price) {
            return res.status(400).json({ message: 'Neužpildyti privalomi laukai' });
        }

        // Išsaugome naują skelbimą kol kas be paveikslėlių
        const newAd = new Ad({ title, description, price, images: [], features, attributes });
        await newAd.save();

        // Pervardiname multer įkeltus failus pagal skelbimo id
        const images = (req.files || []).map((file, i) => {
            const ext = path.extname(file.originalname);
            const newName = `${newAd._id}_${i + 1}${ext}`;
            const oldPath = file.path;
            const newPath = path.join('uploads', newName);

            // Pervadiname failą
            fs.renameSync(oldPath, newPath);

            return newName;
        });

        if (images.length > 0) {
            newAd.images = images;
            await newAd.save();
        }

        res.status(201).json(newAd);
    } catch (err) {
        console.error('Klaida kuriant skelbimą:', err);
        res.status(500).json({ message: 'Nepavyko sukurti skelbimo' });
    }
};

const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Skelbimas nerastas' });

        ad.images.forEach(img => {
            const filePath = path.join('uploads', img);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        await ad.deleteOne();
        res.json({ message: 'Skelbimas ištrintas' });
    } catch (err) {
        console.error('Klaida trinant skelbimą:', err);
        res.status(500).json({ message: 'Nepavyko ištrinti skelbimo' });
    }
};

module.exports = {
    getAllAds,
    getAdById,
    createAd,
    deleteAd
};
