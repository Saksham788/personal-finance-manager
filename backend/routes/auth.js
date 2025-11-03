const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Register Route
router.post('/register', async (req, res) => {
  console.log('📩 Register API called:', req.body);

  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    console.log("⚠️ Missing fields in Register");
    return res.status(400).json({ success: false, msg: "All fields are required" });
  }

  try {
    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("✅ New user saved:", user.email);

    // Create token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: '7d',
    });

    // ✅ Send success response
    return res.status(201).json({
      success: true,
      msg: "Registration successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 Register Error:", err.message);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  console.log('📩 Login API called:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("⚠️ Missing fields in Login");
    return res.status(400).json({ success: false, msg: "Please enter email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found:", email);
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Wrong password for:", email);
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: '7d',
    });

    console.log("✅ Login successful:", email);

    // ✅ Updated response format to match frontend
    return res.json({
      success: true,
      msg: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 Login Error:", err.message);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});

module.exports = router;
