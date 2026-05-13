const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  period:    { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  subject:   { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const timetableSchema = new mongoose.Schema({
  class:    { type: String, required: true },
  day:      { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
  slots:    [slotSchema],
  updatedAt:{ type: Date, default: Date.now }
});

timetableSchema.index({ class: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
