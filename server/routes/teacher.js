const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const { protect, authorize } = require('../middleware/auth');
const { sendWhatsApp } = require('../utils/whatsapp');

const teacherAuth = [protect, authorize('teacher', 'admin')];

// GET /api/teacher/my-class  — students in teacher's assigned class
router.get('/my-class', ...teacherAuth, async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    const cls = teacher?.assignedClass || req.query.class;
    if (!cls) return res.status(400).json({ message: 'No class assigned' });
    const students = await User.find({ role: 'student', class: cls, status: 'approved' })
      .select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teacher/attendance
router.post('/attendance', ...teacherAuth, async (req, res) => {
  try {
    const { date, period, session, class: cls, subject, records } = req.body;
    // records: [{ studentId, status, remark }]

    // Infer class from teacher if not provided
    let targetClass = cls;
    if (!targetClass) {
      const teacher = await User.findById(req.user.id);
      targetClass = teacher?.assignedClass;
    }

    if (!targetClass) return res.status(400).json({ message: 'Teacher has no assigned class' });

    // Upsert attendance
    let att = await Attendance.findOne({ date, period, class: targetClass });
    if (att) {
      att.records = records;
      att.teacherId = req.user.id;
      att.subject = subject;
      await att.save();
    } else {
      att = await Attendance.create({
        date, period, session, class: targetClass, subject,
        teacherId: req.user.id, records
      });
    }

    // Send WhatsApp to absent students' parents
    const absentRecords = records.filter(r => r.status === 'absent');
    for (const rec of absentRecords) {
      const student = await User.findById(rec.studentId);
      if (!student) continue;
      const msg = `Dear Parent,\n\n${student.name} was marked *ABSENT* for ${subject || 'class'} on ${date} (${session} - Period ${period}).\n\nPlease contact the college if needed.\n\n— PU College`;
      if (student.parentWhatsapp) await sendWhatsApp(student.parentWhatsapp, msg);
      else if (student.parentMobile) await sendWhatsApp(student.parentMobile, msg);
    }

    res.json({ message: 'Attendance saved', absentCount: absentRecords.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teacher/attendance?class=11&date=2024-01-15
router.get('/attendance', ...teacherAuth, async (req, res) => {
  try {
    const { class: cls, date, period } = req.query;
    const query = {};
    if (cls)    query.class  = cls;
    if (date)   query.date   = date;
    if (period) query.period = period;
    const records = await Attendance.find(query)
      .populate('records.studentId', 'name studentId regNumber')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teacher/marks
router.post('/marks', ...teacherAuth, async (req, res) => {
  try {
    const { examName, subject, class: cls, entries } = req.body;

    // Infer class from teacher if not provided
    let targetClass = cls;
    if (!targetClass) {
      const teacher = await User.findById(req.user.id);
      targetClass = teacher?.assignedClass;
    }

    if (!targetClass) return res.status(400).json({ message: 'Teacher has no assigned class' });

    // entries: [{ studentId, marks, maxMarks }]
    const marksDoc = await Marks.create({
      examName, subject, class: targetClass,
      teacherId: req.user.id, entries
    });
    res.status(201).json({ message: 'Marks saved', id: marksDoc._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/teacher/marks/:id
router.put('/marks/:id', ...teacherAuth, async (req, res) => {
  try {
    const { entries } = req.body;
    const doc = await Marks.findByIdAndUpdate(req.params.id, { entries }, { new: true });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teacher/marks?class=11&subject=Physics
router.get('/marks', ...teacherAuth, async (req, res) => {
  try {
    const { class: cls, subject } = req.query;
    const query = {};
    if (cls)     query.class   = cls;
    if (subject) query.subject = subject;
    const marks = await Marks.find(query)
      .populate('entries.studentId', 'name studentId regNumber')
      .sort({ date: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teacher/leaderboard?class=11
router.get('/leaderboard', protect, async (req, res) => {
  try {
    let cls = req.query.class;
    
    // If teacher, default to their class
    if (req.user.role === 'teacher') {
      const teacher = await User.findById(req.user.id);
      cls = cls || teacher.assignedClass;
    }

    const query = { role: 'student', status: 'approved' };
    if (cls) query.class = cls;
    const students = await User.find(query).select('-password');

    const leaderboard = [];
    for (const s of students) {
      const allMarks = await Marks.find({ 'entries.studentId': s._id });
      let total = 0, count = 0;
      allMarks.forEach(exam => {
        const entry = exam.entries.find(e => e.studentId.toString() === s._id.toString());
        if (entry) { total += entry.marks; count++; }
      });
      leaderboard.push({
        studentId: s.studentId,
        name: s.name,
        class: s.class,
        id: s._id,
        avgMarks: count ? +(total / count).toFixed(2) : 0,
        totalExams: count
      });
    }

    leaderboard.sort((a, b) => b.avgMarks - a.avgMarks);
    leaderboard.forEach((s, i) => s.rank = i + 1);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
