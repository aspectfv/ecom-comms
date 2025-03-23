const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a JWT token
const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };