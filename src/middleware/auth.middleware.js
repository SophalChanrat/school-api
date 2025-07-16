import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization?.split(' ');
  if (!auth || auth[0] !== 'Bearer') return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(auth[1], process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
