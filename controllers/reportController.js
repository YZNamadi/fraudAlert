const { Report, Transaction } = require('../models');
const { Op } = require('sequelize');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyReport = async (req, res) => {
  try {
    const { reference } = req.params;

    // Find report
    const report = await Report.findOne({ where: { reference } });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Update report & linked transaction
    report.isVerified = true;
    report.isRejected = false;
    await report.save();

    const transaction = await Transaction.findOne({ where: { reference } });
    if (transaction) {
      transaction.status = 'verified';
      transaction.isFraudulent = false;
      transaction.isFlagged = false;
      await transaction.save();
    }

    return res.status(200).json({ message: 'Report verified successfully' });
  } catch (error) {
    console.error('Error verifying report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.approveReport = async (req, res) => {
    try {
      const { reference } = req.params;
  
      const report = await Report.findOne({ where: { reference } });
      if (!report) return res.status(404).json({ message: 'Report not found' });
  
      report.isVerified = true;
      await report.save();
  
      return res.status(200).json({ message: 'Report approved successfully', report });
    } catch (err) {
      console.error('Error approving report:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.rejectReport = async (req, res) => {
  try {
    const { reference } = req.params;

    const report = await Report.findOne({ where: { reference } });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.isVerified = false;
    report.isRejected = true;
    await report.save();

    const transaction = await Transaction.findOne({ where: { reference } });
    if (transaction) {
      transaction.status = 'rejected';
      transaction.isFraudulent = true;
      transaction.isFlagged = true;
      await transaction.save();
    }

    return res.status(200).json({ message: 'Report rejected successfully' });
  } catch (error) {
    console.error('Error rejecting report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all unverified reports
exports.getUnverifiedReports = async (req, res) => {
    try {
      const reports = await Report.findAll({
        where: { isVerified: false },
      });
      return res.status(200).json({ reports });
    } catch (error) {
      console.error('Error fetching unverified reports:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get verified reports
  exports.getVerifiedReports = async (req, res) => {
    try {
      const reports = await Report.findAll({
        where: {
          isVerified: true
        },
        order: [['createdAt', 'DESC']]
      });
      return res.status(200).json({ reports });
    } catch (error) {
      console.error('Error fetching verified reports:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get reports by date range
  exports.getReportsByDate = async (req, res) => {
    const { start, end } = req.query;
  
    // Validate date inputs
    if (!start || !end || isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return res.status(400).json({ message: 'Invalid or missing start/end date' });
    }
  
    try {
      const reports = await Report.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(start),
            [Op.lte]: new Date(end),
          }
        },
        order: [['createdAt', 'DESC']]
      });
      return res.status(200).json({ reports });
    } catch (error) {
      console.error('Error fetching reports by date:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };