const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship'); // Added this import
const auth = require('../middleware/auth');

// Middleware to verify role is Industry Supervisor
const isSupervisor = (req, res, next) => {
  if (req.user.role !== 'industry_supervisor') {
    return res.status(403).json({ error: 'Access Denied. Industry Supervisor only.' });
  }
  next();
};

// 1. Get all applications for internships posted by this supervisor's company
router.get('/applications/company', auth, isSupervisor, async (req, res) => {
  try {
    // Check if supervisor has a company ID
    if (!req.user.companyId) {
      return res.json({ message: 'Supervisor is not linked to a company yet.', applications: [] });
    }

    // Find all internships that belong to this company
    const internships = await Internship.find({ companyId: req.user.companyId });
    const internshipIds = internships.map(intern => intern._id);

    // Find applications that match those internships
    const applications = await Application.find({ 
      internshipId: { $in: internshipIds } 
    })
    .populate('studentId', 'name email department') // Get student details
    .populate('internshipId', 'title'); // Get internship title
        
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
});

// 2. Update application status (Accept or Reject)
router.put('/applications/:id', auth, isSupervisor, async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    
    const application = await Application.findById(req.params.id).populate('internshipId');
    
    // Security check
    if (!application.internshipId || application.internshipId.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to review this application.' });
    }

    application.status = status;
    await application.save();
    
    res.json({ message: `Application ${status} successfully`, application });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating application' });
  }
});
const Evaluation = require('../models/Evaluation');
const sendEmail = require('../utils/emailService');

// 3. SUBMIT EVALUATION FOR STUDENT
router.post('/evaluations', auth, isSupervisor, async (req, res) => {
  try {
    const { studentId, score, comments } = req.body;
    
    const evaluation = new Evaluation({
      studentId,
      supervisorId: req.user.id,
      score,
      comments
    });
    await evaluation.save();
    res.status(201).json({ message: 'Evaluation submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error submitting evaluation' });
  }
});

// 4. OVERRIDE: ACCEPT AND SEND EMAIL
// We will modify the accept route to ALSO send an email
router.put('/applications/:id/accept-with-email', auth, isSupervisor, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'email name')
      .populate('internshipId', 'title');

    if (!application) return res.status(404).json({ error: 'Application not found' });

    // 1. Update status
    application.status = 'Accepted';
    await application.save();

    // 2. Send Email to the Student
    const studentEmail = application.studentId.email;
    const studentName = application.studentId.name;
    const internshipTitle = application.internshipId.title;

    if (studentEmail) {
      await sendEmail(
        studentEmail,
        '🎉 Internship Application Approved!',
        `Dear ${studentName},\n\nCongratulations! Your application for "${internshipTitle}" has been accepted by the supervisor. You may now begin your logbook entries.\n\nBest regards,\nSIWES Management System`
      );
    }

    res.json({ message: 'Application accepted and student notified via email!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error processing acceptance' });
  }
});
module.exports = router;