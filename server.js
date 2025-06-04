// server.js - Complete Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

// Logger Middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};
app.use(logger);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new ValidationError('Unauthorized: Invalid or missing API key', 401));
  }
  next();
};

// Validation Middleware for POST and PUT
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || typeof name !== 'string' ||
      !description || typeof description !== 'string' ||
      !price || typeof price !== 'number' || price <= 0 ||
      !category || typeof category !== 'string' ||
      inStock === undefined || typeof inStock !== 'boolean') {
    return next(new ValidationError('Invalid product data: check field types and values'));
  }
  next();
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Apply authentication to all /api/products routes
app.use('/api/products', authenticate);

// GET /api/products - Get all products with filtering, search, and pagination
app.get('/api/products', (req, res) => {
  let result = [...products];

  // Search by name
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  // Filter by category
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResult = result.slice(startIndex, endIndex);

  res.status(200).json({
    total: result.length,
    page,
    limit,
    products: paginatedResult
  });
});

// GET /api/products/stats - Get product statistics (count by category)
app.get('/api/products/stats', (req, res) => {
  const stats = {};
  products.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
  });
  res.json({ stats });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.status(200).json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', validateProduct, (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const product = {
    id: uuidv4(),
    name,
    description,
    price: parseFloat(price),
    category,
    inStock: Boolean(inStock)
  };
  products.push(product);
  res.status(201).json(product);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProduct, (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  const { name, description, price, category, inStock } = req.body;
  product.name = name;
  product.description = description;
  product.price = parseFloat(price);
  product.category = category;
  product.inStock = Boolean(inStock);
  res.status(200).json(product);
});



// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return next(new NotFoundError('Product not found'));
  }
  products.splice(index, 1);
  res.status(204).send();
});



// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name,
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;