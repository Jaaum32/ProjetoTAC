const express = require('express');
const router = express.Router();
const CowLocation = require('../models/CowLocation');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Obter todas as localizações de bois
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const locations = await CowLocation.find(); // SELECT * FROM cow_locations
    res.json(locations);
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
    const { idBoi, latitude, longitude, data } = req.body;
    const location = new CowLocation({ idBoi, latitude, longitude, data });
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

module.exports = router;
