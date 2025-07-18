const express = require('express');
const AdminAuthController = require('../controllers/AdminAuthController');
const ProductController = require('../controllers/ProductController');
const adminAuthMiddleware = require('../middleware/auth');

const router = express.Router();
const adminAuthController = new AdminAuthController();
const productController = new ProductController();

// Admin auth routes
router.post('/auth/register', (req, res) => adminAuthController.register(req, res));
router.post('/auth/login', (req, res) => adminAuthController.login(req, res));

// Product routes (protected)
router.post('/products', adminAuthMiddleware, (req, res) => productController.createProduct(req, res));
router.get('/products', adminAuthMiddleware, (req, res) => productController.getAllProducts(req, res));
router.get('/products/:id', adminAuthMiddleware, (req, res) => productController.getProductById(req, res));
router.put('/products/:id', adminAuthMiddleware, (req, res) => productController.updateProduct(req, res));
router.delete('/products/:id', adminAuthMiddleware, (req, res) => productController.deleteProduct(req, res));

// Public route for users to get products
router.get('/public/products', (req, res) => productController.getAllProducts(req, res));

module.exports = router;