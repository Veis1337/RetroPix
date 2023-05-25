const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user in the database
      const user = await User.create({ username, password: hashedPassword });
  
      // Generate a JWT
      const token = jwt.sign({ id: user.id, username: user.username }, 'secret');
  
      // Respond with the token
      res.json({ token });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // User login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ where: { username } });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Compare the provided password with the stored password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // Check if the password matches
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate a JWT
      const token = jwt.sign({ id: user.id, username: user.username }, 'secret');
  
      // Respond with the token
      res.json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // User logout
  router.post('/logout', authenticateToken, (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  });
  
module.exports = router;
