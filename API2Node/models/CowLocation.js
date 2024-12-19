const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
    idBoi: { type: String, required: true }, // ID único do boi
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }, // Data da última localização
    geofenceId: { type: String, default: "67644f2c7daa482efbac3151" }, // ID do geofence onde o boi está atualmente
    isOutsideGeofence: { type: Boolean, default: false } // Indica se está fora da geofence
});

module.exports = mongoose.model('Localizacao', LocalizacaoSchema);