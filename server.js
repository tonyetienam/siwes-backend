require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const studentActivityRoutes = require('./routes/studentActivityRoutes');
const academicRoutes = require('./routes/academicRoutes'); // <--- Added this line

const app = express();

// --- CORS CONFIGURATION (CRITICAL FOR FILE UPLOADS) ---
const allowedOrigins = ['http://localhost:3000', 'https://siwes-frontend-six.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- CREATE UPLOADS FOLDER IF IT DOESN'T EXIST ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// --- SERVE STATIC FILES (SO IMAGES CAN BE VIEWED) ---
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

// Mount Routes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', companyRoutes);
app.use('/api', studentRoutes);
app.use('/api', supervisorRoutes);
app.use('/api', coordinatorRoutes);
app.use('/api', studentActivityRoutes);
app.use('/api', academicRoutes); // <--- Added this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend API running on port ${PORT}`));