const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// POST /api/products/optimize - Fetch and optimize product listing
router.post('/optimize', productController.optimizeProduct);

// GET /api/products/history/:asin - Get optimization history for specific ASIN
router.get('/history/:asin', productController.getHistory);

// GET /api/products/history - Get all optimization history
router.get('/history', productController.getAllHistory);

module.exports = router;
