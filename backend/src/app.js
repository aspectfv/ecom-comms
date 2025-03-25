const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/index');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to database')
})

// Middleware
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api', routes);

const frontendPath = path.join(__dirname, '../../frontend/dist')

app.use(express.static(frontendPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
})

// Error handling middleware
app.use(errorHandler);

module.exports = app;
