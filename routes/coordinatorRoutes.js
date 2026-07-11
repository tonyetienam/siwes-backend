const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const Logbook = require('../models/Logbook');
const auth = require('../middleware/auth');

// Middleware to verify role is Department Coordinator
const isCoordinator = (req, res, next) => {
  if (req.user.role !== 'department_coordinator') {
    return res.status(403).json({ error: 'Access Denied.' });
  }
  next();
};

// 1. Get students in the Coordinator's department
router.get('/dept/students', auth, isCoordinator, async (req, res) => {
  const students = await User.find({ role: 'student', department: req.user.department }).select('-password');
  res.json(students);
});

// 2. Get Logbooks for students in the department
router.get('/dept/logbooks', auth, isCoordinator, async (req, res) => {
  const students = await User.find({ role: 'student', department: req.user.department });
  const studentIds = students.map(s => s._id);
  const logs = await Logbook.find({ studentId: { $in: studentIds } }).populate('studentId', 'name');
  res.json(logs);
});

module.exports = router;