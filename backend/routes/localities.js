const express = require('express');
const router = express.Router();
const localitiesController = require('../controllers/localitiesController');

router.get('/localities', localitiesController.getLocalities);

module.exports = router;
