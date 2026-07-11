const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Logbook = require('../models/Logbook');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// Middleware to verify role is Student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access Denied. Students only.' });
  }
  next();
};

// --- FILE UPLOAD SETUP (FIXED FOR RENDER PRODUCTION) ---
// Configure multer to store files in an absolute path 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path to ensure it works on Render cloud servers
    const dir = path.join(__dirname, '../uploads');
    // Create the folder if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Save file with a timestamp to prevent overwrites
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. SUBMIT DAILY LOGBOOK (With optional file upload)
router.post('/logbooks', auth, isStudent, upload.single('attachment'), async (req, res) => {
  try {
    const { content, date } = req.body;
    // If a file was uploaded, construct the URL path to serve it
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const logbook = new Logbook({
      studentId: req.user.id,
      content,
      date: date || new Date(),
      fileUrl,
      status: 'Pending'
    });
    await logbook.save();
    res.status(201).json({ message: 'Logbook submitted successfully!', logbook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error submitting logbook' });
  }
});

// 2. GET STUDENT'S LOGBOOK HISTORY
router.get('/logbooks/my', auth, isStudent, async (req, res) => {
  try {
    const logs = await Logbook.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching logbooks' });
  }
});

// 3. SUBMIT ATTENDANCE (Check-in)
router.post('/attendance', auth, isStudent, async (req, res) => {
  try {
    const { location, date } = req.body;
    
    // Prevent double-check-in on the same day
    const today = new Date().toDateString();
    const existing = await Attendance.findOne({ 
      studentId: req.user.id, 
      date: { $gte: new Date(today) } 
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already checked in today!' });
    }

    const attendance = new Attendance({
      studentId: req.user.id,
      date: date || new Date(),
      location: location || 'Unknown',
      status: 'Present'
    });
    await attendance.save();
    res.status(201).json({ message: 'Attendance checked in successfully!', attendance });
  } catch (err) {
    res.status(500).json({ error: 'Server error checking in attendance' });
  }
});

// 4. GET ATTENDANCE HISTORY
router.get('/attendance/my', auth, isStudent, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching attendance' });
  }
});

module.exports = router;