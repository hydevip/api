const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
},
  { versionKey: false });

module.exports = mongoose.model('Customer', customerSchema);