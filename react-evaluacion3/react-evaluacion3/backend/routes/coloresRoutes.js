const express = require('express');
const router = express.Router();
const coloresController = require('../controllers/coloresController');

router.get('/', coloresController.getAllColores);
router.get('/:id', coloresController.getColorById);
router.post('/', coloresController.createColor);
router.put('/:id', coloresController.updateColor);
router.delete('/:id', coloresController.deleteColor);

module.exports = router;