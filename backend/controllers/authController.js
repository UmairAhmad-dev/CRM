const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // FIXED: Removed the invalid role string. Prisma will now automatically assign the default Role.
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('REGISTER ERROR DETECTED:', error); 
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('LOGIN ERROR DETECTED:', error);
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };