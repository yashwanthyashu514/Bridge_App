const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// Parent routes use the student's ID (stored in token as 'id' or 'studentId')
const parentAuth = [protect, authorize('parent')];

// GET /api/parent/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// GET /api/parent/dashboard
router.get('/dashboard', ...parentAuth, async (req, res) => {
  try {
    const studentId = req.user.id; // In parent login, we store student ID in token
    const student = await User.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // 1. Attendance stats
    const allAttendance = await Attendance.find({ 
      class: student.class,
      'records.studentId': studentId 
    });
    
    let present = 0, absent = 0, leave = 0;
    allAttendance.forEach(att => {
      const rec = att.records.find(r => r.studentId.toString() === studentId.toString());
      if (rec.status === 'present') present++;
      else if (rec.status === 'absent') absent++;
      else if (rec.status === 'leave') leave++;
    });
    const total = present + absent + leave;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    // 2. Marks
    const marksDocs = await Marks.find({ 'entries.studentId': studentId }).sort({ date: -1 });
    const formattedMarks = marksDocs.map(doc => {
      const entry = doc.entries.find(e => e.studentId.toString() === studentId.toString());
      return {
        examName: doc.examName,
        subject: doc.subject,
        marks: entry.marks,
        maxMarks: entry.maxMarks,
        percentage: Math.round((entry.marks / entry.maxMarks) * 100),
        date: doc.date
      };
    });

    // 3. Class Teacher
    const classTeacher = await User.findOne({
      role: 'teacher',
      assignedClass: student.class,
      isClassTeacher: true
    }).select('name subject designation');

    // 4. Announcements
    const announcements = await Announcement.find({
      sendTo: { $in: ['all', 'parent'] }
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      student,
      attendance: { present, absent, leave, percentage },
      marks: formattedMarks,
      classTeacher,
      announcements
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
