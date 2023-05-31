const express = require('express');
const router = express.Router();
const Picture = require('../models/Picture');
const picturesRouter = require('./pictures');
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
    if (req.user.id === 'Guest') {
      // Guest user
      const guestUserId = 'Guest';
      const picture = await Picture.create({ title, caption, drawingData, guestUserId });
      res.status(201).json(picture);
    } else {
      // Authenticated user
      const userId = req.user.id;
      const picture = await Picture.create({ title, caption, drawingData, userId });
      res.status(201).json(picture);
    }
  } catch (error) {
    console.error('Error creating picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  // If we decide to Update a picture
//   router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { title, drawingData } = req.body;
//     try {
//       const picture = await Picture.findByPk(id);
//       if (picture) {
//         picture.title = title;
//         picture.drawingData = drawingData;
//         await picture.save();
//         res.json(picture);
//       } else {
//         res.status(404).json({ error: 'Picture not found' });
//       }
//     } catch (error) {
//       console.error('Error updating picture:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  
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
