const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// GET /api/student/dashboard
router.get('/dashboard', protect, authorize('student'), async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // 1. Attendance
    const today = new Date().toISOString().split('T')[0];
    const allAttendance = await Attendance.find({
      class: student.class,
      'records.studentId': studentId
    });

    let present = 0, absent = 0, leave = 0, total = 0;
    let todayStatus = null;

    allAttendance.forEach(doc => {
      const record = doc.records.find(r => r.studentId.toString() === studentId);
      if (!record) return;
      total++;
      if (record.status === 'present') present++;
      else if (record.status === 'absent') absent++;
      else if (record.status === 'leave') leave++;
      if (doc.date === today) todayStatus = record.status;
    });

    // 2. Marks
    const allMarks = await Marks.find({ 'entries.studentId': studentId }).sort({ date: -1 });
    const formattedMarks = allMarks.map(exam => {
      const entry = exam.entries.find(e => e.studentId.toString() === studentId);
      return {
        examName: exam.examName,
        subject: exam.subject,
        marks: entry?.marks ?? null,
        maxMarks: entry?.maxMarks ?? 100,
        percentage: entry ? +((entry.marks / (entry.maxMarks || 100)) * 100).toFixed(1) : null
      };
    });

    // 3. Announcements
    const announcements = await Announcement.find({
      sendTo: { $in: ['all', 'student'] }
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      student,
      attendance: {
        total, present, absent, leave,
        percentage: total ? +((present / total) * 100).toFixed(1) : 0,
        todayStatus
      },
      marks: formattedMarks,
      announcements
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/profile
router.get('/profile', protect, authorize('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/profile/:id  (for admin/teacher view)
router.get('/profile/:id', protect, authorize('admin','teacher','management'), async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student')
      return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/attendance  (own attendance)
router.get('/attendance', protect, authorize('student'), async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allAttendance = await Attendance.find({
      class: req.user.class || (await User.findById(req.user.id))?.class,
      'records.studentId': req.user.id
    });

    let present = 0, absent = 0, leave = 0, total = 0;
    const todayRecords = [];

    allAttendance.forEach(doc => {
      const record = doc.records.find(r => r.studentId.toString() === req.user.id);
      if (!record) return;
      total++;
      if (record.status === 'present') present++;
      else if (record.status === 'absent') absent++;
      else if (record.status === 'leave') leave++;
      if (doc.date === today) {
        todayRecords.push({
          period: doc.period,
          session: doc.session,
          subject: doc.subject,
          status: record.status
        });
      }
    });

    res.json({
      total, present, absent, leave,
      percentage: total ? +((present / total) * 100).toFixed(1) : 0,
      todayRecords
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/marks  (all exams, all subjects)
router.get('/marks', protect, authorize('student'), async (req, res) => {
  try {
    const allMarks = await Marks.find({ 'entries.studentId': req.user.id })
      .sort({ date: -1 });

    const result = allMarks.map(exam => {
      const entry = exam.entries.find(e => e.studentId.toString() === req.user.id);
      return {
        examName: exam.examName,
        subject: exam.subject,
        date: exam.date,
        marks: entry?.marks ?? null,
        maxMarks: entry?.maxMarks ?? 100,
        percentage: entry ? +((entry.marks / (entry.maxMarks || 100)) * 100).toFixed(1) : null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/marks/:id  (for admin/teacher/parent)
router.get('/marks/:id', protect, authorize('admin','teacher','management','parent'), async (req, res) => {
  try {
    const allMarks = await Marks.find({ 'entries.studentId': req.params.id }).sort({ date: -1 });
    const result = allMarks.map(exam => {
      const entry = exam.entries.find(e => e.studentId.toString() === req.params.id);
      return {
        examName: exam.examName,
        subject: exam.subject,
        date: exam.date,
        marks: entry?.marks ?? null,
        maxMarks: entry?.maxMarks ?? 100,
        percentage: entry ? +((entry.marks / (entry.maxMarks || 100)) * 100).toFixed(1) : null
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/attendance/:id  (for admin/teacher/parent)
router.get('/attendance/:id', protect, authorize('admin','teacher','management','parent'), async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const allAttendance = await Attendance.find({
      class: student.class,
      'records.studentId': req.params.id
    });

    let present = 0, absent = 0, leave = 0, total = 0;
    allAttendance.forEach(doc => {
      const record = doc.records.find(r => r.studentId.toString() === req.params.id);
      if (!record) return;
      total++;
      if (record.status === 'present') present++;
      else if (record.status === 'absent') absent++;
      else if (record.status === 'leave') leave++;
    });

    res.json({
      total, present, absent, leave,
      percentage: total ? +((present / total) * 100).toFixed(1) : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
