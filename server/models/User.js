const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin','teacher','management','student','parent'], required: true },

  // Teacher / Management fields
  designation: { type: String },
  subject:      { type: String },  // teacher only
  employeeId:   { type: String },  // teacher/management generated ID

  // Student fields
  regNumber:        { type: String, unique: true, sparse: true },
  class:            { type: String, enum: ['11','12'] },
  section:          { type: String, enum: ['A','B'] },
  gender:           { type: String, enum: ['Male','Female','Other'] },
  studentMobile:    { type: String },
  studentWhatsapp:  { type: String },
  parentMobile:     { type: String },
  parentWhatsapp:   { type: String },
  studentId:        { type: String, unique: true, sparse: true }, // auto-generated

  // Student approval
  status: {
    type: String,
    enum: ['pending','approved','rejected'],
    default: 'pending'
  },

  // Assigned class (for teacher) - class teacher/tutor
  assignedClass:   { type: String },
  isTutor:         { type: Boolean, default: false },
  isClassTeacher:  { type: Boolean, default: false },

  // Parent → linked students
  linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
