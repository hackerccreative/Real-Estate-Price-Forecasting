const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');

router.post('/predict', predictController.predict);
// Alias for backward compatibility with existing frontend
router.post('/predict_trend', predictController.predict);

module.exports = router;
