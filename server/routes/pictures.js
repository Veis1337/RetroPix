const express = require('express');
const router = express.Router();
const Picture = require('../models/Picture');
const { authenticateToken } = require('../middleware/auth');

// Get all pictures
router.get('/', async (req, res) => {
    try {
      const pictures = await Picture.findAll();
      res.json(pictures);
    } catch (error) {
      console.error('Error retrieving pictures:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get a specific picture by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const picture = await Picture.findByPk(id);
      if (picture) {
        res.json(picture);
      } else {
        res.status(404).json({ error: 'Picture not found' });
      }
    } catch (error) {
      console.error('Error retrieving picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Create a new picture
router.post('/', authenticateToken, async (req, res) => {
  const { title, caption, drawingData } = req.body;

  try {
    if (req.user && req.user.id !== 'Guest') {
      // Authenticated user
      const userId = req.user.id;
      const picture = await Picture.create({ title, caption, drawingData, userId });
      res.status(201).json(picture);
    } else {
      // Guest user
      const guestUserId = 'Guest';
      const picture = await Picture.create({ title, caption, drawingData, guestUserId });
      res.status(201).json(picture);
    }
  } catch (error) {
    console.error('Error creating picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pictures by user
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pictures = await Picture.findAll({
      where: { userId: id },
    });
    res.json(pictures);
  } catch (error) {
    console.error('Error retrieving user pictures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Edit picture
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, drawingData } = req.body;
  try {
    const picture = await Picture.findByPk(id);
    if (picture) {
      picture.title = title;
      picture.drawingData = drawingData;
      await picture.save();
      res.json(picture);
    } else {
      res.status(404).json({ error: 'Picture not found' });
    }
  } catch (error) {
    console.error('Error updating picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Copy picture
router.post('/:id/copy', async (req, res) => {
  const { id } = req.params;
  try {
    const picture = await Picture.findByPk(id);
    if (picture) {
      // Create a copy of the picture with a new ID
      const newPicture = await Picture.create({
        title: picture.title,
        caption: picture.caption,
        drawingData: picture.drawingData,
        userId: picture.userId,
      });
      res.status(201).json(newPicture);
    } else {
      res.status(404).json({ error: 'Picture not found' });
    }
  } catch (error) {
    console.error('Error copying picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a picture
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const picture = await Picture.findByPk(id);
    if (picture) {
      await picture.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Picture not found' });
    }
  } catch (error) {
    console.error('Error deleting picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
module.exports = router;
