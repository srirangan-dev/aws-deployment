const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://d16o598lw6btin.cloudfront.net",
    ];

    if (
      !origin ||
      allowed.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.netlify.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

const authRoutes      = require('./routes/auth');
const chatRoutes      = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');
const eventRoutes      = require('./routes/events');      // NEW
const reminderRoutes   = require('./routes/reminders');   // NEW
const { startScheduler } = require('./utils/scheduler');  // NEW

app.use('/api/auth',      authRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events',    eventRoutes);      // NEW
app.use('/api/reminders', reminderRoutes);   // NEW

app.get('/api/test', (req, res) => res.json({ ok: true, status: 'Server is running' }));

mongoose.connect(process.env.MONGODB_URI, {
  family: 4,
})
  .then(() => console.log('✅ Connected to MongoDB — database: aws'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startScheduler(); // NEW — starts the daily 9am reminder check
});