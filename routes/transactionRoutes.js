const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create transaction
router.post('/transactions', transactionController.createTransaction);

// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

module.exports = router;
