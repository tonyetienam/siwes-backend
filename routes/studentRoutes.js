const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application'); // We will create this next
const auth = require('../middleware/auth');

// Middleware to verify role is Student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access Denied. Students only.' });
  }
  next();
};

// 1. Get All Open Internships
router.get('/internships', auth, isStudent, async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'Open' }).populate('companyId', 'name industry');
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching internships' });
  }
});

// 2. Apply for an Internship
router.post('/applications', auth, isStudent, async (req, res) => {
  try {
    const existing = await Application.findOne({ 
      studentId: req.user.id, 
      internshipId: req.body.internshipId 
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this internship.' });
    }

    const application = new Application({
      studentId: req.user.id,
      internshipId: req.body.internshipId,
      status: 'Pending'
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (err) {
    res.status(500).json({ error: 'Server error submitting application' });
  }
});

// 3. Get Student's Application History
router.get('/applications/my', auth, isStudent, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'internshipId',
        populate: { path: 'companyId', select: 'name' }
      });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching applications' });
  }
});

module.exports = router;