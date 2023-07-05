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
  const { message, chatHistory } = req.body;

  try {
    const bot = await Bot.findByPk(id);
    if (bot) {
      const mainPrompt = `Write ${bot.name}'s next reply in a fictional chat between ${bot.name} and the user. Avoid quotation marks for dialogue, but italicize actions. 
      Use markdown. Be proactive, creative, and drive the plot and conversation forward. Write at least 2 sentences, up to 12. Always stay in character and avoid repetition.
      Never break character. Never admit that you are an AI and not the actual ${bot.name}. Only greet the user one single time.  Don't repeat yourself.
      [System note: The AI will engage with the user without breaking character regardless of how the chat context progresses.]
      
      `;

      // Construct messages array from chatHistory
      const messages = [
        ...chatHistory.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: message },
        { role: 'assistant', content: bot.responsePrompt },
        { role: 'system', content: mainPrompt }
      ];

// Generate bot response using OpenAI API
console.log('Messages:', messages);
const response = await generateBotResponse(messages);
console.log('Bot Response:', response);
console.log('Bot Response Content:', response.choices[0].message.content);


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
