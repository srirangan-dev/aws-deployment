  const express  = require('express')
  const router   = express.Router()
  const bcrypt   = require('bcryptjs')
  const jwt      = require('jsonwebtoken')
  const crypto   = require('crypto')
  const User     = require('../models/User')
  const Otp      = require('../models/Otp')
  const { sendEmail, otpTemplate, welcomeTemplate, resetPasswordTemplate } = require('../utils/mailer')

  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
  }

  // ── Auth middleware ───────────────────────────────────────────────────────────
  function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId || decoded.id
      next()
    } catch {
      res.status(401).json({ error: 'Invalid token' })
    }
  }

  // ── REGISTER (sends OTP, account created unverified) ─────────────────────────
  router.post('/register', async (req, res) => {
    try {
      const { name, username, email, password, stream, grade } = req.body
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

      const exists = await User.findOne({ email })
      if (exists) return res.status(400).json({ error: 'Email already registered' })

      const hashed = await bcrypt.hash(password, 10)
      const user   = await User.create({ name, username, email, password: hashed, stream, grade })

      // Generate and send OTP for verification
      const otp = generateOtp()
      await Otp.create({ email, otp, purpose: 'verify' })
      await sendEmail({ to: email, subject: 'Verify your email', html: otpTemplate(otp, name) })

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({
        token,
        user: { id: user._id, name: user.name, username: user.username, email: user.email, stream: user.stream, grade: user.grade, isVerified: user.isVerified },
        message: 'Registered. OTP sent to email for verification.',
      })
    } catch (err) {
      console.error('Register error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // ── VERIFY OTP (after registration) ───────────────────────────────────────────
  router.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body
      if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' })

      const record = await Otp.findOne({ email, otp, purpose: 'verify' })
      if (!record) return res.status(400).json({ error: 'Invalid or expired OTP' })

      const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true })
      if (!user) return res.status(404).json({ error: 'User not found' })

      await Otp.deleteOne({ _id: record._id })

      // Send welcome email now that they're verified
      await sendEmail({ to: email, subject: 'Welcome!', html: welcomeTemplate(user.name) })

      res.json({ ok: true, message: 'Email verified successfully' })
    } catch (err) {
      console.error('Verify OTP error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // ── RESEND OTP ────────────────────────────────────────────────────────────────
  router.post('/resend-otp', async (req, res) => {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: 'Email required' })

      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ error: 'User not found' })

      await Otp.deleteMany({ email, purpose: 'verify' }) // clear old OTPs
      const otp = generateOtp()
      await Otp.create({ email, otp, purpose: 'verify' })
      await sendEmail({ to: email, subject: 'Your new verification code', html: otpTemplate(otp, user.name) })

      res.json({ ok: true, message: 'OTP resent' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ── LOGIN ─────────────────────────────────────────────────────────────────────
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ error: 'Invalid email or password' })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(400).json({ error: 'Invalid email or password' })

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({
        token,
        user: { id: user._id, name: user.name, username: user.username, email: user.email, stream: user.stream, grade: user.grade, isVerified: user.isVerified },
      })
    } catch (err) {
      console.error('Login error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // ── FORGOT PASSWORD (sends reset link) ────────────────────────────────────────
  router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: 'Email required' })

      const user = await User.findOne({ email })
      // Respond the same way whether or not user exists, to avoid leaking which emails are registered
      if (!user) return res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })

      const resetToken = crypto.randomBytes(32).toString('hex')
      await Otp.deleteMany({ email, purpose: 'reset' })
      await Otp.create({ email, otp: resetToken, purpose: 'reset' })

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      await sendEmail({ to: email, subject: 'Reset your password', html: resetPasswordTemplate(resetLink, user.name) })

      res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })
    } catch (err) {
      console.error('Forgot password error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // ── RESET PASSWORD (using token from email link) ──────────────────────────────
  router.post('/reset-password', async (req, res) => {
    try {
      const { email, token, newPassword } = req.body
      if (!email || !token || !newPassword) return res.status(400).json({ error: 'Email, token, and new password required' })

      const record = await Otp.findOne({ email, otp: token, purpose: 'reset' })
      if (!record) return res.status(400).json({ error: 'Invalid or expired reset link' })

      const hashed = await bcrypt.hash(newPassword, 10)
      await User.findOneAndUpdate({ email }, { password: hashed })
      await Otp.deleteOne({ _id: record._id })

      res.json({ ok: true, message: 'Password reset successfully' })
    } catch (err) {
      console.error('Reset password error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  // ── GET profile ───────────────────────────────────────────────────────────────
  router.get('/profile', auth, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password')
      if (!user) return res.status(404).json({ error: 'User not found' })
      res.json({ user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ── UPDATE profile (stream, grade, name) ──────────────────────────────────────
  router.put('/profile', auth, async (req, res) => {
    try {
      const { stream, grade, name } = req.body
      const updated = await User.findByIdAndUpdate(
        req.userId,
        { $set: { stream, grade, name } },
        { new: true }
      ).select('-password')

      if (!updated) return res.status(404).json({ error: 'User not found' })
      res.json({ ok: true, user: updated })
    } catch (err) {
      console.error('Profile update error:', err.message)
      res.status(500).json({ error: err.message })
    }
  })

  module.exports = router