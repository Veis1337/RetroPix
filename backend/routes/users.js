const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a user
router.put('/:id', authenticateToken, async (req, res) => {
  const authenticatedUser = req.user;
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const userToUpdate = await User.findByPk(id);
    if (userToUpdate) {
      userToUpdate.username = username;
      userToUpdate.email = email;
      userToUpdate.password = password;
      await userToUpdate.save();
      res.json(userToUpdate);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
  const authenticatedUser = req.user;
  const { id } = req.params;
  try {
    const userToDelete = await User.findByPk(id);
    if (userToDelete) {
      await userToDelete.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
