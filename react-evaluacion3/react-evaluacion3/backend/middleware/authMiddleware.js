const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarioModel');

// Middleware para verificar JWT y usuario activo
async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    const user = await Usuarios.getById(decoded.id);
    if (!user || user.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario deshabilitado' });
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Middleware para verificar rol admin
function admin(req, res, next) {
  // if (req.user && req.user.role === 'admin') {
    next();
  // } else {
  //   res.status(403).json({ message: 'Acceso solo para administradores' });
  // }
}

module.exports = { auth, admin }; 