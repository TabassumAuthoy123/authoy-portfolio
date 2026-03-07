const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const Admin = require('../models/Admin');
const router = express.Router();

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ valid: false });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ valid: false });
    
    res.json({ valid: true, email: admin.email });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'No admin found with that email' });

    // Generate 6-digit numeric OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    
    admin.resetOTP = otp;
    admin.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    
    // Using save with validateBeforeSave: false in case other fields trigger validation (not strictly necessary here but safe)
    await admin.save({ validateBeforeSave: false });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Portfolio Admin - Password Reset OTP',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your portfolio admin panel.</p>
        <p>Your OTP is: <b style="font-size: 24px; color: #4F46E5;">${otp}</b></p>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>`
    });

    res.json({ message: 'OTP sent successfully to email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP. Ensure email credentials are set in .env.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email, resetOTP: otp, resetOTPExpiry: { $gt: Date.now() } });
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email, resetOTP: otp, resetOTPExpiry: { $gt: Date.now() } });
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    admin.password = newPassword;
    admin.resetOTP = undefined;
    admin.resetOTPExpiry = undefined;
    await admin.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
