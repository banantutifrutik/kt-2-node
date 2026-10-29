const express = require('express');
const router = express.Router();
const { validateProduct, validatePatch } = require('../middleware/validate');
const upload = require('../middleware/upload');

let products = [];
let nextId = 1;

router.get('/', (req, res) => {
    let result = [...products];
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    if (category) result = result.filter(p => p.category === category);
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const total = result.length;
    const paginatedData = result.slice(startIndex, endIndex);

    res.json({
        data: paginatedData,
        total: total,
        page: pageNum,
        limit: limitNum
    });
});


router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});


router.post('/', validateProduct, (req, res) => {
    const newProduct = {
        id: nextId++,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});


router.put('/:id', validateProduct, (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    products[index] = { 
        ...req.body, 
        id: products[index].id, 
        createdAt: products[index].createdAt 
    };
    res.json(products[index]);
});


router.patch('/:id', validatePatch, (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});


router.delete('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    products.splice(index, 1);
    res.status(204).send();
});


router.post('/:id/image', (req, res, next) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

    const uploadSingle = upload.single('image');
    
    uploadSingle(req, res, (err) => {
        if (err) return next(err);
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const imageUrl = `/uploads/${req.file.filename}`;
        products[productIndex].imageUrl = imageUrl;
        
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            product: products[productIndex]
        });
    });
});

module.exports = router;