const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Logbook = require('../models/Logbook');
const auth = require('../middleware/auth');

// Middleware to verify role is Academic Supervisor
const isAcademic = (req, res, next) => {
  if (req.user.role !== 'academic_supervisor') {
    return res.status(403).json({ error: 'Access Denied. Academic Supervisor only.' });
  }
  next();
};

// Get students in the supervisor's department
router.get('/academic/students', auth, isAcademic, async (req, res) => {
  try {
    const students = await User.find({ role: 'student', department: req.user.department }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching students' });
  }
});

// Get logbooks for students in the department
router.get('/academic/logbooks', auth, isAcademic, async (req, res) => {
  try {
    const students = await User.find({ role: 'student', department: req.user.department });
    const studentIds = students.map(s => s._id);
    const logs = await Logbook.find({ studentId: { $in: studentIds } }).populate('studentId', 'name');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching logbooks' });
  }
});

module.exports = router;