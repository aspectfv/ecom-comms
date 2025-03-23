const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes/index');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

const frontendPath = path.join(__dirname, '../../frontend/dist')

app.use(express.static(frontendPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
