// Handle Mongoose duplicate key errors
const handleDuplicateKeyError = (error) => {
  const duplicateKey = Object.keys(error.keyValue)[0];
  const capitalizedKey = duplicateKey.charAt(0).toUpperCase() + duplicateKey.slice(1); // Capitalize the key
  return `${capitalizedKey} is already taken. Please choose a different ${duplicateKey}.`;
};

// Handle Mongoose validation errors
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => err.message);
  return `Validation error: ${errors.join(', ')}`;
};

// General error-handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific Mongoose errors
  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 400; // Bad Request
    message = handleDuplicateKeyError(err);
  } else if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    message = handleValidationError(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;