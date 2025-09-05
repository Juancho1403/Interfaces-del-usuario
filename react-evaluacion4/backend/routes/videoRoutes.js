const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y rol admin
router.use(auth.auth, auth.admin);

router.get('/', videoController.getVideos);
const upload = require('../middleware/multerConfig');
router.post(
	'/',
	upload.fields([
		{ name: 'video', maxCount: 1 },
		{ name: 'audios', maxCount: 5 }
	]),
	videoController.createVideo
);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;