const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  date:      { type: String, required: true }, // "YYYY-MM-DD"
  type:      { type: String, enum: ['holiday','event','exam','other'], default: 'event' },
  color:     { type: String, default: '#4f46e5' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calendar', calendarSchema);
