require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

async function createSupervisor() {
  const hash = await bcrypt.hash('123456', 10);
  const user = new User({ 
    name: 'Company Supervisor', 
    email: 'supervisor@techcorp.com', 
    password: hash, 
    role: 'industry_supervisor',
    // Note: In a real app, companyId would be auto-linked. 
    // For now, you must copy the ID from MongoDB Atlas and paste it here or set it from the Admin Panel.
  });
  await user.save();
  console.log('✅ Supervisor Created! Email: supervisor@techcorp.com | Password: 123456');
  console.log('⚠️ IMPORTANT: You MUST open the Admin Panel and assign this user to "TechCorp" (or whatever company you created) by clicking the dropdown to set their company.');
  mongoose.connection.close();
}
createSupervisor();