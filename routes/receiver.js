const express = require('express');
const { body } = require('express-validator');

const receiverController = require('../controllers/receiver');
const Receiver = require('../models/receiver');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// CREATE RECEIVER USER /receiver/signup
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return Receiver.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
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
  receiverController.signup
);

// LOGIN RECEIVER USER /receiver/login
router.post('/login', receiverController.login);

// REQUEST BLOOD-SAMPLE /receiver/bloodsample
router.post('/bloodsample', isAuth, receiverController.requestBloodSample);

module.exports = router;
