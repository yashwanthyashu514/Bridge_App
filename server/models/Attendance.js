const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:     { type: String, enum: ['present','absent','leave'], required: true },
  remark:     { type: String } // required if leave
});

const attendanceSchema = new mongoose.Schema({
  date:    { type: String, required: true },  // "YYYY-MM-DD"
  period:  { type: String, required: true },  // e.g. "1", "2", AM, PM
  session: { type: String, enum: ['AM','PM'], required: true },
  class:   { type: String, required: true },
  subject: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  records: [attendanceRecordSchema],
  createdAt: { type: Date, default: Date.now }
});

// One attendance doc per date+period+class
attendanceSchema.index({ date: 1, period: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
