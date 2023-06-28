const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Bot = require('../models/Bot');
const { generateBotResponse } = require('../utils/botUtils');

// Get all bots
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bots = await Bot.findAll();
    res.json(bots);
  } catch (error) {
    console.error('Error retrieving bots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new bot
router.post('/', authenticateToken, async (req, res) => {
  const { name, responsePrompt, personality, avatar, firstMessage } = req.body;

  try {
    const bot = await Bot.create({
      name,
      responsePrompt,
      personality,
      avatar,
      firstMessage,
    });

    res.status(201).json(bot);
  } catch (error) {
    console.error('Error creating bot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a bot
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, responsePrompt, personality, avatar, firstMessage } = req.body;

  try {
    const bot = await Bot.findByPk(id);
    if (bot) {
      bot.name = name;
      bot.responsePrompt = responsePrompt;
      bot.personality = personality;
      bot.avatar = avatar;
      bot.firstMessage = firstMessage;
      await bot.save();
      res.json(bot);
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a bot
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const bot = await Bot.findByPk(id);
    if (bot) {
      await bot.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/messages', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  

  try {
    const bot = await Bot.findByPk(id);
    if (bot) {
      const mainPrompt = `Write ${bot.name}'s next reply in a fictional chat between ${bot.name} and the user.  Write 1 reply only in internet RP style, italicize actions, and avoid quotation marks. Be proactive, creative, and drive the plot and conversation forward. Write at least 1 paragraph, up to 4. Always stay in character and avoid repetition.`
      // Construct messages array
      const messages = [
        { role: 'user', content: message },
        { role: 'assistant', content: bot.responsePrompt },
        { role: 'system', content: mainPrompt }
      ];

      // Generate bot response using OpenAI API
      const response = await generateBotResponse(messages);

      res.json({ botId: bot.id, message, response });
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error sending message to bot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
