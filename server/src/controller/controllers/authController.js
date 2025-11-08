// src/controllers/authController.js
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabaseClient');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.signupValidators = [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;

  try {
    // check existing
    const { data: existing, error: e1 } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (e1) throw e1;
    if (existing && existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash, role: role || 'student' }])
      .select('*')
      .single();

    if (error) throw error;

    const token = jwt.sign({ userId: data.id, role: data.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // remove password hash in response
    delete data.password_hash;

    res.status(201).json({ user: data, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message || err });
  }
};

exports.loginValidators = [
  body('email').isEmail(),
  body('password').exists(),
];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: data.id, role: data.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    delete data.password_hash;
    res.json({ user: data, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message || err });
  }
};

exports.getProfile = async (req, res) => {
  // authMiddleware will attach req.user = { userId, role }
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error) throw error;
    res.json({ user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch profile failed', error: err.message || err });
  }
};
