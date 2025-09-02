const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');
const auth = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y rol admin
router.use(auth.auth, auth.admin);

router.get('/', imagenController.getImagenes);
router.post('/', imagenController.createImagen);
router.put('/:id', imagenController.updateImagen);
router.delete('/:id', imagenController.deleteImagen);

module.exports = router;