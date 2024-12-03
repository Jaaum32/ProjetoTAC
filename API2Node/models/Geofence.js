const mongoose = require('mongoose');

const CoordenadaSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
});

const GeofenceSchema = new mongoose.Schema({
    nome: { type: String, required: true },  // Nome do cercado
    descricao: { type: String },            // Informação adicional
    coordenadas: { 
        type: [CoordenadaSchema],           // Array de coordenadas dinâmico
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 3; // Pelo menos 3 coordenadas para formar uma área
            },
            message: 'O Geofence deve conter pelo menos 3 coordenadas.'
        }
    }
});

module.exports = mongoose.model('Geofence', GeofenceSchema);
