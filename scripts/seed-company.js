require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');

mongoose.connect(process.env.MONGO_URI);

async function seedCompany() {
  const company = new Company({
    name: 'Nairda Limited',
    address: 'Lagos, Nigeria',
    industry: 'Technology',
    description: 'A software development company.',
    contactEmail: 'hr@nairda.com'
  });
  await company.save();
  console.log('✅ Company "Nairda Limited" created successfully!');
  console.log('🆔 Company ID:', company._id.toString());
  mongoose.connection.close();
}
seedCompany();