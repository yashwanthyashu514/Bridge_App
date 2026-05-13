const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');
const { generateEmployeeId } = require('../utils/idGenerator');
const { sendWhatsAppBulk } = require('../utils/whatsapp');
const { sendEmailBulk } = require('../utils/mailer');

const adminOnly = [protect, authorize('admin')];

// POST /api/admin/create-staff
router.post('/create-staff', ...adminOnly, async (req, res) => {
  try {
    const { name, designation, subject, email, password, role } = req.body;
    // role must be 'teacher' or 'management'
    if (!['teacher','management'].includes(role))
      return res.status(400).json({ message: 'Role must be teacher or management' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const employeeId = generateEmployeeId(role, name);
    const user = await User.create({
      name, email, password, role, designation, subject, employeeId, status: 'approved'
    });

    res.status(201).json({
      message: `${role} account created`,
      employeeId: user.employeeId,
      id: user._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/create-parent
router.post('/create-parent', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, linkedStudentIds } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const parent = await User.create({
      name, email, password, role: 'parent',
      linkedStudents: linkedStudentIds || [],
      status: 'approved'
    });
    res.status(201).json({ message: 'Parent account created', id: parent._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/teachers
router.get('/teachers', ...adminOnly, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/management
router.get('/management', ...adminOnly, async (req, res) => {
  try {
    const mgmt = await User.find({ role: 'management' }).select('-password');
    res.json(mgmt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/students
router.get('/students', ...adminOnly, async (req, res) => {
  try {
    const { class: cls, section, status } = req.query;
    const query = { role: 'student' };
    if (cls) query.class = cls;
    if (section) query.section = section;
    if (status) query.status = status;
    const students = await User.find(query).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/assign-class/:teacherId
router.put('/assign-class/:teacherId', ...adminOnly, async (req, res) => {
  try {
    const { assignedClass, isClassTeacher, isTutor } = req.body;
    const teacher = await User.findByIdAndUpdate(
      req.params.teacherId,
      { assignedClass, isClassTeacher, isTutor },
      { new: true }
    ).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/staff/:id
router.delete('/staff/:id', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/announcement
router.post('/announcement', protect, authorize('admin','teacher'), async (req, res) => {
  try {
    const { title, description, sendTo } = req.body;

    const ann = await Announcement.create({
      title, description, sendTo,
      createdBy: req.user.id === 'admin' ? null : req.user.id,
      createdByRole: req.user.role
    });

    // Collect recipients
    const roles = sendTo.includes('all')
      ? ['student','teacher','parent']
      : sendTo;

    const users = await User.find({ role: { $in: roles }, status: 'approved' });
    const whatsappNums = [];
    const emails = [];

    users.forEach(u => {
      if (u.email) emails.push(u.email);
      const num = u.role === 'parent' ? u.studentWhatsapp : (u.studentWhatsapp || u.whatsapp);
      if (num) whatsappNums.push(num);
      // Also parent whatsapp for students
      if (u.parentWhatsapp) whatsappNums.push(u.parentWhatsapp);
    });

    const waMsg = `📢 *${title}*\n\n${description}\n\n— PU College Bridge App`;
    const emailHtml = `<h2>${title}</h2><p>${description}</p><br><small>PU College Bridge App</small>`;

    await sendWhatsAppBulk([...new Set(whatsappNums)], waMsg);
    await sendEmailBulk([...new Set(emails)], title, emailHtml);

    ann.sentViaWhatsapp = true;
    ann.sentViaEmail = true;
    await ann.save();

    res.json({ message: 'Announcement sent', id: ann._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/announcements
router.get('/announcements', protect, async (req, res) => {
  try {
    const anns = await Announcement.find()
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(anns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
