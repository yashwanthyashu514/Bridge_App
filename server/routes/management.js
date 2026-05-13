const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fees = require('../models/Fees');
const Timetable = require('../models/Timetable');
const Calendar = require('../models/Calendar');
const { protect, authorize } = require('../middleware/auth');

const mgmtAuth = [protect, authorize('management', 'admin')];

// ── FEES ──────────────────────────────────────────────

// GET /api/management/fees
router.get('/fees', ...mgmtAuth, async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate('studentId', 'name studentId regNumber class');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/management/fees/:studentId/pay
router.put('/fees/:studentId/pay', ...mgmtAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Valid amount required' });

    const feesDoc = await Fees.findOne({ studentId: req.params.studentId });
    if (!feesDoc) return res.status(404).json({ message: 'Fees record not found' });

    feesDoc.paid += Number(amount);
    feesDoc.payments.push({ amount, recordedBy: req.user.id });
    feesDoc.updatedAt = Date.now();
    await feesDoc.save();

    res.json({ message: 'Payment recorded', fees: feesDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/management/set-fees
router.post('/set-fees', ...mgmtAuth, async (req, res) => {
  try {
    const { class11, class12 } = req.body;
    
    const updates = [];
    if (class11) {
      const students11 = await User.find({ role: 'student', class: '11', status: 'approved' });
      updates.push(...students11.map(s => 
        Fees.findOneAndUpdate({ studentId: s._id }, { totalFees: Number(class11) }, { upsert: true })
      ));
    }
    if (class12) {
      const students12 = await User.find({ role: 'student', class: '12', status: 'approved' });
      updates.push(...students12.map(s => 
        Fees.findOneAndUpdate({ studentId: s._id }, { totalFees: Number(class12) }, { upsert: true })
      ));
    }

    await Promise.all(updates);
    res.json({ message: 'Fees updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── TIMETABLE ─────────────────────────────────────────

// GET /api/management/timetable?class=11
router.get('/timetable', protect, async (req, res) => {
  try {
    const { class: cls } = req.query;
    const query = {};
    if (cls) query.class = cls;
    const tt = await Timetable.find(query)
      .populate('slots.teacherId', 'name subject');
    res.json(tt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/management/timetable
router.put('/timetable', ...mgmtAuth, async (req, res) => {
  try {
    const { class: cls, day, slots } = req.body;
    const tt = await Timetable.findOneAndUpdate(
      { class: cls, day },
      { slots, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(tt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CALENDAR ──────────────────────────────────────────

// GET /api/management/calendar
router.get('/calendar', protect, async (req, res) => {
  try {
    const events = await Calendar.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/management/calendar
router.post('/calendar', ...mgmtAuth, async (req, res) => {
  try {
    const { title, date, type, color } = req.body;
    const event = await Calendar.create({ title, date, type, color, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/management/calendar/:id
router.delete('/calendar/:id', ...mgmtAuth, async (req, res) => {
  try {
    await Calendar.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
