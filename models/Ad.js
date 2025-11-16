const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    features: {
        type: Map,
        of: String,
        default: {},
    },
    attributes: {
        type: mongoose.Schema.Types.Mixed,  // <--- ČIA PASIKEISTI Į Mixed
        default: {},
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', adSchema);
