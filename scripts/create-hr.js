require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

async function createHR() {
  // Check if user already exists
  const existing = await User.findOne({ email: 'hr@techcorp.com' });
  if (existing) {
    console.log('⚠️ HR User already exists! No changes made.');
    mongoose.connection.close();
    return;
  }

  const hash = await bcrypt.hash('123456', 10);
  const user = new User({ 
    name: 'TechCorp HR', 
    email: 'hr@techcorp.com', 
    password: hash, 
    role: 'company_hr' 
  });
  await user.save();
  console.log('✅ HR User Created!');
  console.log('📧 Email: hr@techcorp.com');
  console.log('🔑 Password: 123456');
  mongoose.connection.close();
}
createHR();