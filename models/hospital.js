const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  requestedSamples: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Receiver',
    },
  ],
  availableSamples: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BloodSample',
    },
  ],
});

module.exports = mongoose.model('Hospital', hospitalSchema);
