import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// Slow down brute-force attempts
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const cookieOptions = {
  httpOnly: true,                                   // JS cannot read it (XSS protection)
  sameSite: 'lax',                                  // CSRF mitigation
  secure: process.env.NODE_ENV === 'production',    // HTTPS only in production
  maxAge: 60 * 60 * 1000,                           // 1 hour
};

const sendToken = (res, user, status = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, cookieOptions);
  res.status(status).json({ user: { id: user._id, name: user.name, email: user.email } });
};

router.post('/register', limiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password }); // hashed by pre-save hook
    sendToken(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', limiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    // Same message for wrong email / wrong password -> no user enumeration
    if (!user || !(await user.comparePassword(password || '')))
      return res.status(401).json({ message: 'Invalid email or password' });
    sendToken(res, user);
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ user: { id: _id, name, email } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.json({ message: 'Logged out' });
});

export default router;
