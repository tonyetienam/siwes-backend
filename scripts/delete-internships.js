require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('../models/Internship');

mongoose.connect(process.env.MONGO_URI);

async function deleteAllInternships() {
  // This deletes ALL internships from the database
  const result = await Internship.deleteMany({});
  console.log(`✅ Successfully deleted ${result.deletedCount} internship(s).`);
  mongoose.connection.close();
}

deleteAllInternships();