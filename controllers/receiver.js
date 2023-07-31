const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const keys = require('../config/keys');
const Receiver = require('../models/receiver');
const Hospital = require('../models/hospital');
const BloodSample = require('../models/blood-sample');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, Entered data is incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const bloodGroup = req.body.bloodGroup;

    const hashedPassword = await bcrypt.hash(password, 12);
    const receiver = new Receiver({
      email: email,
      password: hashedPassword,
      name: name,
      bloodGroup: bloodGroup,
      role: 'RECEIVER',
    });

    const result = await receiver.save();

    res.status(201).json({
      message: 'Receiver user created successfully!',
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userDoc = await Receiver.findOne({ email: email });
    if (!userDoc) {
      const error = new Error('User with the entered email cannot be found!');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, userDoc.password);
    if (!isEqual) {
      const error = new Error('Incorrect password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: userDoc.email,
        userId: userDoc._id.toString(),
        role: userDoc.role,
      },
      keys.jwtTokenKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: token,
      userId: userDoc._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.requestBloodSample = async (req, res, next) => {
  try {
    const receiverDoc = await Receiver.findById(req.userId);

    const bloodSample = await BloodSample.findOne({
      bloodGroup: receiverDoc.bloodGroup,
    });
    if (!bloodSample) {
      const error = new Error('Requested blood sample does not exist!');
      error.statusCode = 404;
      throw error;
    }

    const hospitalDoc = await Hospital.findById(bloodSample.hospital);
    hospitalDoc.requestedSamples.push(receiverDoc);
    await hospitalDoc.save();

    res.status(200).json({
      message: 'Request for blood sample successfully made!',
      sampleId: bloodSample._id.toString(),
      bloodGroup: bloodSample.bloodGroup,
      hospitalName: hospitalDoc.name,
      receiverName: receiverDoc.name,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
