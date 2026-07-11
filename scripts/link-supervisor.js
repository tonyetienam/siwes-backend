require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

async function linkSupervisor() {
  // 1. PASTE YOUR REAL 24-CHARACTER ID HERE
  const companyId = "67f8a2b1c3d4e5f6a7b8c9d0"; // Paste your real ID here
  // 2. Find the Supervisor by email
  const supervisor = await User.findOne({ email: 'supervisor@techcorp.com' });
  
  if (!supervisor) {
    console.log('❌ Supervisor not found!');
    mongoose.connection.close();
    return;
  }

  // 3. Attach the company ID
  supervisor.companyId = new mongoose.Types.ObjectId(companyId);
  await supervisor.save();
  
  console.log(`✅ Supervisor (${supervisor.email}) successfully linked to company ID: ${companyId}`);
  mongoose.connection.close();
}

linkSupervisor();