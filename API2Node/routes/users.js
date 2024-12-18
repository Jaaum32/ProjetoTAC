const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Obter todos usuários
router.get('/', isAuthenticated, async function(req, res, next) {
  // SELECT * FROM user  
  const users = await User.find(); // Obter todos

  res.json(users);
});

// Obter um usuário pelo ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params; 
  //const id = req.params.id;
  
  const user = await User.findById(id);

  return user
    ? res.json(user)
    : res.status(404).json({ message: "id não existe"});
});

// Criar um usuário (POST)
router.post('/', async (req, res) => {
  // Receber dados do Body (HTTP)
  const body = req.body;
  
  const user = new User(body); // Instancia de User
  await user.save(); // Inserir no DB

  // Gerar uma resposta para o cliente
  res.status(201).json(user);
});

module.exports = router;