const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');

// Middleware to verify role is Company HR
const isCompanyHR = (req, res, next) => {
  if (req.user.role !== 'company_hr') {
    return res.status(403).json({ error: 'Access Denied. Company HR only.' });
  }
  next();
};

// 1. Register a Company (HR user creates their company profile)
router.post('/company/register', auth, isCompanyHR, async (req, res) => {
  const company = new Company({ ...req.body });
  await company.save();
  
  // Link the company ID to the HR user
  req.user.companyId = company._id;
  await req.user.save();
  
  res.status(201).json({ message: 'Company registered successfully!', company });
});

// 2. Post a new Internship Opportunity
router.post('/internships', auth, isCompanyHR, async (req, res) => {
  // Make sure the HR user has a companyId set
  if (!req.user.companyId) {
    return res.status(400).json({ error: 'Please register your company profile first.' });
  }
  
  const internship = new Internship({ 
    ...req.body, 
    companyId: req.user.companyId 
  });
  await internship.save();
  res.status(201).json({ message: 'Internship posted successfully!', internship });
});

// 3. Get all internships posted by this HR's company
router.get('/internships/my', auth, isCompanyHR, async (req, res) => {
  if (!req.user.companyId) return res.json([]);
  const internships = await Internship.find({ companyId: req.user.companyId });
  res.json(internships);
});

module.exports = router;