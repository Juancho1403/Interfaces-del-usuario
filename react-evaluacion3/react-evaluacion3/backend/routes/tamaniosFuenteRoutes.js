const express = require('express');
const router = express.Router();
const tamaniosFuenteController = require('../controllers/tamaniosFuenteController');

router.get('/', tamaniosFuenteController.getTamaniosFuente);
router.put('/', tamaniosFuenteController.updateTamaniosFuente);

module.exports = router;