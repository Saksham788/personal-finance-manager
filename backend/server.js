require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('Smart Finance Manager API is running');
});

// ✅ Route Not Found (404)
app.use((req, res, next) => {
  console.log(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ msg: 'Route not found' });
});

// ✅ Global Error Handler (500)
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ msg: 'Internal server error', error: err.message });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
