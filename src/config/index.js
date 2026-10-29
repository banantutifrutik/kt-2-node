const express = require('express');
const path = require('path');
const productRoutes = require('./src/routes/products');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/products', productRoutes);


app.use((req, res) => res.status(404).json({ error: 'Not Found' }));


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});