require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');

async function createNewSupervisor() {
  // 1. Connect to the database (This fixes the timeout error)
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // 2. Find the Nairda Limited company
  const company = await Company.findOne({ name: 'Nairda Limited' });
  if (!company) {
    console.log('❌ Company "Nairda Limited" not found! Run the seed-company.js script first.');
    process.exit();
  }
  console.log(`✅ Found Company: ${company.name} (ID: ${company._id})`);

  // 3. Delete old supervisor if exists
  await User.deleteOne({ email: 'newsuper@techcorp.com' });

  // 4. Create the new perfectly linked supervisor
  const hash = await bcrypt.hash('123456', 10);
  const sup = new User({
    name: 'New Super',
    email: 'newsuper@techcorp.com',
    password: hash,
    role: 'industry_supervisor',
    companyId: company._id // This creates the perfect link!
  });

  await sup.save();
  console.log('✅ BRAND NEW SUPERVISOR CREATED!');
  console.log('📧 Email: newsuper@techcorp.com');
  console.log('🔑 Password: 123456');
  console.log('🚀 This supervisor is perfectly linked to Nairda Limited.');
  
  process.exit();
}

createNewSupervisor();