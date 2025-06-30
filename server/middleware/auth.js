import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyUser = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    req.user = { id: user._id, username: user.username }; // only attach what's needed
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
