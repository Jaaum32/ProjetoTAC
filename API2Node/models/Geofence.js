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
    },
    corTerreno: { 
        type: String,                        // Cor em formato RGB
        required: true,
        match: /^#([0-9A-Fa-f]{6})$/,       // Valida formato hexadecimal RGB
        default: '#00FF00'                  // Cor padrão (verde)
    },
    pontoCentral: {type: [CoordenadaSchema]}
});

// Método para calcular o ponto central entre as coordenadas
GeofenceSchema.methods.calcularCentro = function() {
    if (!this.coordenadas || this.coordenadas.length === 0) {
        throw new Error('Nenhuma coordenada disponível para calcular o centro.');
    }

    const total = this.coordenadas.length;

    // Soma todas as latitudes e longitudes
    const soma = this.coordenadas.reduce(
        (acumulador, coord) => ({
            latitude: acumulador.latitude + coord.latitude,
            longitude: acumulador.longitude + coord.longitude
        }),
        { latitude: 0, longitude: 0 }
    );

    // Calcula as médias para obter o centro
    return {
        latitude: soma.latitude / total,
        longitude: soma.longitude / total
    };
};

module.exports = mongoose.model('Geofence', GeofenceSchema);
