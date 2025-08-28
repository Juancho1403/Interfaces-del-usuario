const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y rol admin
router.use(auth.auth, auth.admin);

router.get('/', videoController.getVideos);
router.post('/', videoController.createVideo);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;