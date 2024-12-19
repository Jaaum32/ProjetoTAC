const express = require('express');
const router = express.Router();
const Geofence = require('../models/Geofence');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Obter todos os Geofences
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const geofences = await Geofence.find(); // SELECT * FROM geofences
    res.json(geofences);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter Geofences', error: error.message });
  }
});


// Obter um Geofence pelo ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const geofence = await Geofence.findById(id); // SELECT * FROM geofences WHERE id = ?
    return geofence
      ? res.json(geofence)
      : res.status(404).json({ message: 'Geofence não encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter Geofence', error: error.message });
  }
});

// Criar um Geofence
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { nome, descricao, coordenadas, corTerreno } = req.body;
    if (!coordenadas || coordenadas.length < 3) {
      return res.status(400).json({ message: 'O Geofence precisa de pelo menos 3 coordenadas.' });
    }
    const geofence = new Geofence({ nome, descricao, coordenadas, ...(corTerreno && { corTerreno }) });
    geofence.pontoCentral = geofence.calcularCentro();

    await geofence.save(); // INSERT INTO geofences
    res.status(201).json(geofence);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar Geofence', error: error.message });
  }
});

// Atualizar um Geofence pelo ID
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const geofence = await Geofence.findByIdAndUpdate(id, updates, { new: true }); // UPDATE geofences SET ...
    return geofence
      ? res.json(geofence)
      : res.status(404).json({ message: 'Geofence não encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar Geofence', error: error.message });
  }
});

// Deletar um Geofence pelo ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const geofence = await Geofence.findByIdAndDelete(id); // DELETE FROM geofences WHERE id = ?
    return geofence
      ? res.json({ message: 'Geofence deletado com sucesso' })
      : res.status(404).json({ message: 'Geofence não encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar Geofence', error: error.message });
  }
});

module.exports = router;
