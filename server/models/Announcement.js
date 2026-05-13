const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  sendTo:      [{ type: String, enum: ['all','parent','teacher','student'] }],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByRole: { type: String },
  sentViaWhatsapp: { type: Boolean, default: false },
  sentViaEmail:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
