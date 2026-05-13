const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fees = require('../models/Fees');
const { protect, authorize } = require('../middleware/auth');
const { generateStudentId } = require('../utils/idGenerator');

const signToken = (user) => jwt.sign(
  { id: user._id, role: user.role, name: user.name, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE }
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    // Check fixed admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin', name: 'Principal', email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      return res.json({ token, role: 'admin', name: 'Principal', email });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // Student must be approved
    if (user.role === 'student' && user.status !== 'approved')
      return res.status(403).json({
        message: user.status === 'pending'
          ? 'Your account is pending teacher approval'
          : 'Your account has been rejected'
      });

    const token = signToken(user);
    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      id: user._id,
      class: user.class,
      subject: user.subject,
      assignedClass: user.assignedClass
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/signup  (student self-registration)
router.post('/signup', async (req, res) => {
  try {
    const {
      name, regNumber, class: cls, section, studentMobile, studentWhatsapp,
      parentMobile, parentWhatsapp, email, password, gender
    } = req.body;

    if (!name || !regNumber || !cls || !section || !email || !password || !gender)
      return res.status(400).json({ message: 'All required fields must be filled' });

    const exists = await User.findOne({ $or: [{ email }, { regNumber }] });
    if (exists) return res.status(409).json({ message: 'Email or Reg Number already registered' });

    const studentId = generateStudentId(regNumber, cls);

    const student = await User.create({
      name, email, password, role: 'student',
      regNumber, class: cls, section, gender,
      studentMobile, studentWhatsapp,
      parentMobile, parentWhatsapp,
      studentId, status: 'pending'
    });

    res.status(201).json({
      message: 'Registration submitted. Please wait for your class teacher to approve your account.',
      studentId: student.studentId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.id === 'admin') {
      return res.json({ role: 'admin', name: 'Principal', email: process.env.ADMIN_EMAIL });
    }
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/pending-students  (teacher approves)
router.get('/pending-students', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    let query = { role: 'student', status: 'pending' };
    // Teacher only sees their assigned class
    if (req.user.role === 'teacher') {
      const teacher = await User.findById(req.user.id);
      if (teacher.assignedClass) query.class = teacher.assignedClass;
    }
    const students = await User.find(query).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/approve/:studentId
router.put('/approve/:studentId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const student = await User.findByIdAndUpdate(
      req.params.studentId,
      { status },
      { new: true }
    ).select('-password');

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Auto-create fees record on approval
    if (status === 'approved') {
      const existing = await Fees.findOne({ studentId: student._id });
      if (!existing) {
        await Fees.create({ studentId: student._id, totalFees: 0, paid: 0 });
      }
    }

    res.json({ message: `Student ${status}`, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/parent-login
router.post('/parent-login', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) return res.status(400).json({ message: 'Mobile number required' });

    // Check student parent contacts
    const student = await User.findOne({ 
      $or: [
        { parentMobile: mobileNumber },
        { parentWhatsapp: mobileNumber }
      ]
    });

    if (!student) return res.status(404).json({ message: 'No student found with this parent contact' });

    const token = jwt.sign(
      { id: student._id, role: 'parent', studentId: student._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, role: 'parent', name: `Parent of ${student.name}`, user: { _id: student._id, role: 'parent', name: `Parent of ${student.name}` } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
