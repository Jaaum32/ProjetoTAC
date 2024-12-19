const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
    idBoi: { type: String, required: true }, // ID único do boi
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }, // Data da última localização
    geofenceId: { type: String } // ID do geofence onde o boi está atualmente
});

module.exports = mongoose.model('Localizacao', LocalizacaoSchema);
