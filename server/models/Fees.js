const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount:     { type: Number, required: true },
  date:       { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const feesSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalFees:  { type: Number, default: 0 },
  paid:       { type: Number, default: 0 },
  payments:   [paymentSchema],
  updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fees', feesSchema);
