const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authenticateToken } = require('../middleware/auth');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments by picture ID
router.get('/picture/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { pictureId: id },
    });
    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new comment
router.post('/', authenticateToken, async (req, res) => {
  const { pictureId, comment } = req.body;

  try {
    if (req.user.id === 'Guest') {
      res.status(403).json({ error: 'Please sign in to post comments.' });
      return;
    }

    const newComment = await Comment.create({
      pictureId,
      text: comment,
      userId: req.user.id,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
