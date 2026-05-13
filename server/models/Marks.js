const mongoose = require('mongoose');

const markEntrySchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks:      { type: Number, required: true },
  maxMarks:   { type: Number, default: 100 }
});

const marksSchema = new mongoose.Schema({
  examName:  { type: String, required: true },
  subject:   { type: String, required: true },
  class:     { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entries:   [markEntrySchema],
  date:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marks', marksSchema);
