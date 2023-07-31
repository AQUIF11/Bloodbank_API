const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const keys = require('../config/keys');
const Hospital = require('../models/hospital');
const BloodSample = require('../models/blood-sample');
const Receiver = require('../models/receiver');

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

    const hashedPassword = await bcrypt.hash(password, 12);
    const hospital = new Hospital({
      email: email,
      password: hashedPassword,
      name: name,
      role: 'HOSPITAL',
    });

    const result = await hospital.save();

    res.status(201).json({
      message: 'Hospital user created successfully!',
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
    const userDoc = await Hospital.findOne({ email: email });
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

exports.addBloodSample = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, Entered data is incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userDoc = await Hospital.findById(req.userId);

    // SAVE BLOOD-SAMPLE IN DB
    const bloodSample = new BloodSample({
      bloodGroup: req.body.bloodGroup,
      hospital: userDoc._id,
    });
    await bloodSample.save();

    // UPDATE HOSPITAL-OBJECT
    userDoc.availableSamples.push(bloodSample);
    await userDoc.save();

    res.status(201).json({
      message: 'Blood sample added successfully!',
      bloodSample: bloodSample,
      hospital: { _id: userDoc._id, name: userDoc.name },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.updateBloodSample = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, Entered data is incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sampleId = req.params.sampleId;
    const bloodGroup = req.body.bloodGroup;

    const bloodSample = await BloodSample.findById(sampleId).populate(
      'hospital'
    );
    if (!bloodSample) {
      const error = new Error('Could not find the blood sample!');
      error.statusCode = 404;
      throw error;
    }

    if (bloodSample.hospital._id.toString() !== req.userId) {
      const error = new Error('Not authorized to update this blood sample!');
      error.statusCode = 403;
      throw error;
    }

    bloodSample.bloodGroup = bloodGroup;
    const result = await bloodSample.save();

    res.status(200).json({
      message: 'Blood sample updated successfully!',
      bloodSample: {
        _id: result._id,
        hospitalName: result.hospital.name,
        bloodGroup: result.bloodGroup,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deleteBloodSample = async (req, res, next) => {
  try {
    const sampleId = req.params.sampleId;
    const bloodSample = await BloodSample.findById(sampleId).populate(
      'hospital'
    );
    if (!bloodSample) {
      const error = new Error('Could not find the blood sample!');
      error.statusCode = 404;
      throw error;
    }

    if (bloodSample.hospital._id.toString() !== req.userId) {
      const error = new Error('Not authorized to delete this blood sample!');
      error.statusCode = 403;
      throw error;
    }

    await BloodSample.findByIdAndRemove(sampleId);

    const userDoc = await Hospital.findById(req.userId);
    userDoc.availableSamples.pull(sampleId);
    await userDoc.save();

    res.status(200).json({
      message: 'Blood sample deleted successfully!',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getBloodSamples = async (req, res, next) => {
  try {
    const userDoc = await Hospital.findById(req.userId);

    const samples = [];

    for (const sampleId of userDoc.availableSamples) {
      let sample = await BloodSample.findById(sampleId);
      sample = sample.toObject();
      delete sample.hospital;
      delete sample.__v;
      samples.push(sample);
    }

    res.status(200).json({
      message: 'Blood samples retrieved successfully!',
      hospitalName: userDoc.name,
      numberOfSamples: samples.length,
      bloodSamples: samples,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getBloodSampleRequests = async (req, res, next) => {
  try {
    const bloodGroup = req.params.bloodGroup.trim().toUpperCase();

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

    if (!bloodGroups.has(bloodGroup)) {
      const error = new Error('Invalid blood-group entered!');
      error.statusCode = 422;
      throw error;
    }

    const hospitalDoc = await Hospital.findById(req.userId);

    const requests = [];

    for (const receiverId of hospitalDoc.requestedSamples) {
      const receiverDoc = await Receiver.findById(receiverId);
      if (receiverDoc.bloodGroup === bloodGroup) {
        const { _id, name, email } = receiverDoc;
        requests.push({ receiverId: _id.toString(), name: name, email: email });
      }
    }

    res.status(200).json({
      message: 'Blood sample requests retrieved successfully!',
      hospitalId: hospitalDoc._id.toString(),
      hospitalName: hospitalDoc.name,
      bloodGroup: bloodGroup,
      numberOfRequests: requests.length,
      sampleRequests: requests,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
