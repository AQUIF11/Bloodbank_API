const BloodSample = require('../models/blood-sample');

exports.getAllBloodSamples = async (req, res, next) => {
  try {
    const bloodSampleDocs = await BloodSample.find().populate('hospital');

    const bloodSamples = [];

    for (const bloodSample of bloodSampleDocs) {
      const { _id, bloodGroup, createdAt, updatedAt } = bloodSample;
      bloodSamples.push({
        sampleId: _id.toString(),
        hospitalName: bloodSample.hospital.name,
        hospitalEmail: bloodSample.hospital.email,
        bloodGroup: bloodGroup,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    }

    res.status(200).json({
      message: 'Blood samples retrieved successfully!',
      numberOfSamples: bloodSamples.length,
      bloodSamples: bloodSamples,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
