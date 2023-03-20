const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bloodSampleSchema = new Schema(
  {
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodSample', bloodSampleSchema);
