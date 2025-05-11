const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/', reportController.getAllReports);
router.put('/verify/:reference', reportController.verifyReport);
router.put('/approve/:reference', reportController.approveReport);
router.put('/reject/:reference', reportController.rejectReport);
router.get('/unverified', reportController.getUnverifiedReports);
router.get('/verified', reportController.getVerifiedReports);
router.get('/by-date', reportController.getReportsByDate);
module.exports = router;
