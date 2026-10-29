module.exports = (err, req, res, next) => {
    console.error('Unhandled Error:', err);

    if (err instanceof require('multer').MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Max size is 2MB.' });
        }
    }
    
    if (err.message === 'Only JPEG and PNG images are allowed') {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal Server Error' });
};