const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();

// Auth routes
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));

// User routes (protected)
router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.post('/bank-details', authMiddleware, (req, res) => userController.addBankDetails(req, res));
router.put('/bank-details/:bankDetailId', authMiddleware, (req, res) => userController.updateBankDetail(req, res));
router.delete('/bank-details/:bankDetailId', authMiddleware, (req, res) => userController.deleteBankDetail(req, res));
router.get('/products', authMiddleware, (req, res) => userController.getProducts(req, res));

module.exports = router;