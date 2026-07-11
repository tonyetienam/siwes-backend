const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: String,
  address: String,
  industry: String,
  description: String,
  contactEmail: String,
  website: String
});

module.exports = mongoose.model('Company', CompanySchema);