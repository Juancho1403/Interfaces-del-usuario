const Usuarios = require('../models/usuarioModel').Usuarios;
const jwt = require('jsonwebtoken');

// Generar JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secreto', {
    expiresIn: '1d',
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Intentando registrar usuario:', req.body);

    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      console.log('Faltan campos');
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (password !== confirmPassword) {
      console.log('Contraseñas no coinciden');
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }
    const exists = await Usuarios.getByEmail(email);
    if (exists) {
      console.log('El usuario ya existe');
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const id = await Usuarios.createRegister({ email, password });
    console.log('Usuario registrado con id:', id);
    res.status(201).json({ id, message: 'Usuario registrado exitosamente' });
  } catch (e) {
    console.error('Error en el registro:', e);
    res.status(500).json({ message: 'Error en el registro', error: e.message });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('Datos recibidos en login:', req.body); // Log de entrada
  try {
    const { email, password } = req.body;
    const user = await Usuarios.getByEmail(email);
    if (!user) {
      console.log('No existe usuario con ese email');
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }
    if (user.estado !== 'activo') {
      console.log('Usuario deshabilitado:', user);
      return res.status(403).json({ message: 'Usuario deshabilitado' });
    }
    const valid = await Usuarios.validatePassword(email, password);
    if (!valid) {
      console.log('Contraseña incorrecta para:', email);
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const token = generateToken(user.id, user.role);
    console.log('Login exitoso para:', email, 'Rol:', user.role);
    res.json({ token, role: user.role, id: user.id });
  } catch (e) {
    console.error('Error inesperado en login:', e);
    res.status(500).json({ message: 'Error en el login' });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/usuarios/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await Usuarios.getById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/usuarios/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    await Usuarios.updateProfile(req.user.id, req.body);
    res.json({ message: 'Perfil actualizado' });
  } catch (e) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/usuarios
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await Usuarios.getAllBasic();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// @desc    Crear usuario (POST /api/usuarios)
// @route   POST /api/usuarios
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const id = await Usuarios.create(req.body);
    res.status(201).json({ id, message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Usuario no registrado exitosamente', error: error.message });
  }
};

// @desc    Obtener usuario por ID (GET /api/usuarios/:id)
// @route   GET /api/usuarios/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await Usuarios.getById(req.params.id);
    if (user) {
      delete user.password;
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Actualizar usuario (PUT /api/usuarios/:id)
// @route   PUT /api/usuarios/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    await Usuarios.updateById(req.params.id, req.body);
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// @desc    Deshabilitar/Habilitar usuario (solo admin)
// @route   PATCH /api/usuarios/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    await Usuarios.disableUser(req.params.id);
    res.json({ message: 'Usuario deshabilitado' });
  } catch (e) {
    res.status(500).json({ message: 'Error al deshabilitar usuario' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  toggleUserStatus
}; 