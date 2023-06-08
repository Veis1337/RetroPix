const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

// Get usernames of users by their IDs
router.post('/usernames', async (req, res) => {
  const { userIds } = req.body;

  try {
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'username'],
    });

    const usernames = users.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});

    res.json(usernames);
  } catch (error) {
    console.error('Error retrieving usernames:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update the user's about
router.put('/:id/about', authenticateToken, async (req, res) => {
  const authenticatedUser = req.user;
  const { id } = req.params;
  const { about } = req.body;

  try {
    const userToUpdate = await User.findByPk(id);
    if (userToUpdate) {
      userToUpdate.about = about;
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

// Get user information
router.get('/user-info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users }); // destructuring users response
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

// Update a user's profileAvatar
router.put('/:id/profile-avatar', authenticateToken, async (req, res) => {
  const authenticatedUser = req.user;
  const { id } = req.params;
  const { profileAvatar } = req.body;

  try {
    const userToUpdate = await User.findByPk(id);
    if (userToUpdate) {
      userToUpdate.profileAvatar = profileAvatar;
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
