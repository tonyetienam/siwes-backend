require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  const user = new User({ 
    name: 'System Admin', 
    email: 'admin@siwes.com', 
    password: hash, 
    role: 'admin' 
  });
  await user.save();
  console.log('✅ Admin Created! Email: admin@siwes.com | Password: admin123');
  mongoose.connection.close();
}
createAdmin();