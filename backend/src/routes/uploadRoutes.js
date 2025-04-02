const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadHandler');
const { authenticate, authorize } = require('../utils/auth');
const uploadController = require('../controllers/uploadController');

// Upload single image
router.post(
    '/image', 
    authenticate, 
    upload.single('image'), 
    uploadController.uploadImage
);

// Upload multiple images (max 5)
router.post(
    '/images', 
    authenticate, 
    upload.array('images', 5), 
    uploadController.uploadImages
);

module.exports = router;