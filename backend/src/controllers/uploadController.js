/**
 * Image upload controller methods
 */

// Upload a single image
exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        
        // Create the URL for the uploaded image
        const imageUrl = `/images/${req.file.filename}`;
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            imageUrl 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Image upload failed' });
    }
};

// Upload multiple images (max 5)
exports.uploadImages = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }
        
        // Create URLs for all uploaded images
        const imageUrls = req.files.map(file => `/images/${file.filename}`);
        
        res.status(200).json({ 
            message: 'Images uploaded successfully',
            imageUrls 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Image upload failed' });
    }
};