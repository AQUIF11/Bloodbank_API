const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiverSchema = new Schema({
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
  bloodGroup: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Receiver', receiverSchema);
