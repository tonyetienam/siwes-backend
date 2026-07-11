const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to verify role is Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access Denied. Admins only.' });
  }
  next();
};

// GET: Fetch all users
router.get('/users', auth, isAdmin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// PUT: Update a user's role
router.put('/users/:id', auth, isAdmin, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id, 
    { role: req.body.role }, 
    { new: true }
  ).select('-password');
  res.json({ message: 'User role updated', user: updatedUser });
});

// DELETE: Delete a user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;