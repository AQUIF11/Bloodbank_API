const express = require('express');

const publicController = require('../controllers/public');

const router = express.Router();

// GET ALL UPLOADED BLOOD-SAMPLES OF ALL HOSPITALS /public/bloodsamples
router.get('/bloodsamples', publicController.getAllBloodSamples);

module.exports = router;
