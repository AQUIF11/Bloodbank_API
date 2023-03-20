const express = require('express');
const { body } = require('express-validator');

const hospitalController = require('../controllers/hospital');
const Hospital = require('../models/hospital');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// CREATE HOSPITAL USER /hospital/signup
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return Hospital.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  hospitalController.signup
);

// LOGIN HOSPITAL USER /hospital/login
router.post('/login', hospitalController.login);

// ADD BLOOD-SAMPLE /hospital/bloodsample
router.post(
  '/bloodsample',
  isAuth,
  [
    body('bloodGroup')
      .trim()
      .toUpperCase()
      .custom((value, { req }) => {
        const bloodGroups = new Set([
          'A+',
          'A-',
          'B+',
          'B-',
          'O+',
          'O-',
          'AB+',
          'AB-',
        ]);

        if (!bloodGroups.has(value)) {
          return Promise.reject('Invalid blood-group entered!');
        }

        return Promise.resolve();
      }),
  ],
  hospitalController.addBloodSample
);

// UPDATE BLOOD-SAMPLE /hospital/bloodsample/:sampleId
router.put(
  '/bloodsample/:sampleId',
  isAuth,
  [
    body('bloodGroup')
      .trim()
      .toUpperCase()
      .custom((value, { req }) => {
        const bloodGroups = new Set([
          'A+',
          'A-',
          'B+',
          'B-',
          'O+',
          'O-',
          'AB+',
          'AB-',
        ]);

        if (!bloodGroups.has(value)) {
          return Promise.reject('Invalid blood-group entered!');
        }

        return Promise.resolve();
      }),
  ],
  hospitalController.updateBloodSample
);

// DELETE BLOOD-SAMPLE /hospital/bloodsample/:sampleId
router.delete(
  '/bloodsample/:sampleId',
  isAuth,
  hospitalController.deleteBloodSample
);

// GET ALL UPLOADED BLOOD-SAMPLES OF A HOSPITAL /hospital/bloodsamples
router.get('/bloodsamples', isAuth, hospitalController.getBloodSamples);

// GET ALL SAMPLE REQUESTS FOR PARTICULAR BLOOD-GROUP /hospital/sample-requests/:bloodGroup
router.get(
  '/sample-requests/:bloodGroup',
  isAuth,
  hospitalController.getBloodSampleRequests
);

module.exports = router;
