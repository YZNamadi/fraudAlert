const { Op } = require('sequelize');
const { Transaction, Report } = require('../models');
const { cacheTransaction, getCachedTransaction } = require('../config/redis');
const detectFraud = require('../utils/fraudDetection');

exports.createTransaction = async (req, res) => {
  try {
    // Extract data from request body
    const { id, amount, status, reference, source, currency, timestamp } = req.body;

    console.log('Received transaction:', req.body);

    // Perform fraud detection
    const { isFraudulent, reasons } = detectFraud({ amount, source, status });
    console.log('Fraud check result:', { isFraudulent, reasons });

    // Prevent the same ID from being reused
    const existing = await Transaction.findOne({ where: { id } });
    if (existing) {
      return res.status(409).json({ message: 'Transaction with this ID already exists' });
    }

    // Check Redis cache for the transaction using reference
    const cached = await getCachedTransaction(reference);
    if (cached) {
      return res.status(200).json({
        message: 'Transaction found in cache',
        transaction: cached
      });
    }

    // Check for duplicate transactions within ±60 seconds
    const duplicate = await Transaction.findOne({
      where: {
        reference,
        amount,
        source,
        timestamp: {
          [Op.between]: [
            new Date(new Date(timestamp).getTime() - 60000),
            new Date(new Date(timestamp).getTime() + 60000),
          ]
        }
      }
    });

    const isDuplicate = !!duplicate;

    // Create the transaction record
    const transaction = await Transaction.create({
      id,
      amount,
      status,
      reference,
      source,
      currency,
      timestamp,
      isDuplicate,
      isFlagged: isFraudulent
    });

    // If the transaction is fraudulent, save a report
    if (isFraudulent) {
      await Report.create({
        reference,
        amount,
        source,
        status,
        currency,
        timestamp,
        flaggedReason: reasons.join(', '),
        isVerified: false
      });
    }

    // Cache the transaction
    await cacheTransaction(reference, transaction);

    // Respond with appropriate message
    return res.status(201).json({
      message: isDuplicate
        ? 'Duplicate transaction created'
        : isFraudulent
        ? 'Transaction flagged as potentially fraudulent'
        : 'Transaction created successfully',
      transaction,
      reasons: isFraudulent ? reasons : undefined
    });

  } catch (error) {
    console.error('Error creating transaction:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
