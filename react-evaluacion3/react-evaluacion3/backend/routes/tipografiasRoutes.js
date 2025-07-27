const express = require('express');
const router = express.Router();
const multer = require('multer');
const tipografiasController = require('../controllers/tipografiasController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', tipografiasController.getAllTipografias);
router.get('/:id', tipografiasController.getTipografiaById);
router.get('/:id/file/:type', tipografiasController.getTipografiaFile);
router.post('/', 
    upload.fields([
        { name: 'archivo_titulo', maxCount: 1 },
        { name: 'archivo_texto', maxCount: 1 }
    ]), 
    tipografiasController.createTipografia
);
router.delete('/:id', tipografiasController.deleteTipografia);

module.exports = router;