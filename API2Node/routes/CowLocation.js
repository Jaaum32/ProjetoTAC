const express = require('express');
const router = express.Router();
const CowLocation = require('../models/CowLocation');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Função para movimentar a vaca em direções aleatórias
const moveCow = (latitude, longitude) => {
  const displacement = 0.0000075; // Incremento por segundo em graus (aproximado)

  // Calcula deslocamento independente para latitude e longitude
  const randomLatFactor = Math.random() * displacement; // Aleatoriedade no deslocamento da latitude
  const randomLngFactor = Math.random() * displacement; // Aleatoriedade no deslocamento da longitude

  const latDirection = Math.random() < 0.5 ? -1 : 1; // Decide se vai para norte ou sul
  const lngDirection = Math.random() < 0.5 ? -1 : 1; // Decide se vai para leste ou oeste

  const newLatitude = latitude + latDirection * randomLatFactor; // Atualiza latitude
  const newLongitude = longitude + lngDirection * randomLngFactor; // Atualiza longitude

  return { newLatitude, newLongitude };
};



// Obter todas as localizações de bois e mover cada vaca
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const locations = await CowLocation.find(); // SELECT * FROM cow_locations

    // Movimentar cada vaca
    const updatedLocations = await Promise.all(
      locations.map(async (location) => {
        const { newLatitude, newLongitude } = moveCow(location.latitude, location.longitude);

        // Atualizar no banco
        location.latitude = newLatitude;
        location.longitude = newLongitude;
        await location.save();

        return location; // Retorna a localização atualizada
      })
    );

    res.json(updatedLocations);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter localizações de bois', error: error.message });
  }
});

// Obter a localização de um boi pelo ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const location = await CowLocation.findById(id); // SELECT * FROM cow_locations WHERE id = ?
    return location
      ? res.json(location)
      : res.status(404).json({ message: 'Localização não encontrada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter localização', error: error.message });
  }
});

// Criar uma localização para o boi
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { idBoi, latitude, longitude, data, geofenceId } = req.body;

    const location = new CowLocation({ idBoi, latitude, longitude, data, geofenceId });
    await location.save(); // INSERT INTO cow_locations
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar localização', error: error.message });
  }
});


// Atualizar a localização de um boi pelo ID
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const location = await CowLocation.findByIdAndUpdate(id, updates, { new: true }); // UPDATE cow_locations SET ...
    return location
      ? res.json(location)
      : res.status(404).json({ message: 'Localização não encontrada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar localização', error: error.message });
  }
});

// Deletar uma localização pelo ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const location = await CowLocation.findByIdAndDelete(id); // DELETE FROM cow_locations WHERE id = ?
    return location
      ? res.json({ message: 'Localização deletada com sucesso' })
      : res.status(404).json({ message: 'Localização não encontrada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar localização', error: error.message });
  }
});

// Obter o registro de localização pelo ID do boi
router.get('/boi/:idBoi', isAuthenticated, async (req, res) => {
  try {
    const { idBoi } = req.params; // ID do boi vindo do parâmetro de rota
    const location = await CowLocation.findOne({ idBoi }); // Busca pelo ID do boi no banco

    return location
      ? res.json({ id: location._id }) // Retorna o ID do registro
      : res.status(404).json({ message: 'Localização não encontrada para este boi' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar localização pelo ID do boi', error: error.message });
  }
});


module.exports = router;

