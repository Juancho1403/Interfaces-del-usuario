const express = require('express');
const router = express.Router();
const Usuarios = require('../models/usuarioModel').Usuarios;
const usuarioController = require('../controllers/usuarioController');
const { auth, admin } = require('../middleware/authMiddleware');

// Listar usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuarios.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const id = await Usuarios.create(req.body);
    res.status(201).json({ id, message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Usuario no registrado exitosamente', error: error.message });
  }
});

// Registro y login públicos
router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);

// Perfil usuario autenticado
router.get('/profile', auth, usuarioController.getProfile);
router.put('/profile', auth, usuarioController.updateProfile);

// Listar usuarios (solo admin)
router.get('/admin', auth, admin, usuarioController.getUsers);

// Deshabilitar usuario (solo admin)
router.patch('/:id/disable', auth, admin, usuarioController.toggleUserStatus);

// Obtener un usuario por ID (añadido para funcionalidad de ver/editar)
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuarios.getById(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un usuario por ID (añadido para funcionalidad de editar)
router.put('/:id', async (req, res) => {
  try {
    await Usuarios.updateById(req.params.id, req.body);
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

module.exports = router; 