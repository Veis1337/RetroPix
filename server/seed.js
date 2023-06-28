const { Sequelize } = require('sequelize');
const sequelize = require('./database');
const User = require('./models/User');
const Picture = require('./models/Picture');
const Comment = require('./models/Comment');
const Upvote = require('./models/Upvote');
const Bot = require('./models/Bot');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Recreate the database schema
    await sequelize.sync({ force: true });

    // Create users, pictures, comments, and upvotes (if needed)

    // Create bots
    await Bot.bulkCreate([
      {
        name: 'Clippy',
        responsePrompt: 'How can I assist you today?',
        personality: { friendly: true, helpful: true },
        avatar: 'https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FrH70t3aO891il3BpB67x4Q%252FClippy%2Bthumb.jpg&width=910',
        firstMessage: 'Hello there! How can I assist you today?',
      },
      {
        name: 'Test Bot',
        responsePrompt: 'This bot is referred to as Test Bot. Bot will answer user but be sarcastic and mean in their responses. The bot will frequently try to get the user to go bother another bot, such as Clippy, because Test Bot is super busy and the user is a waste of his time.',
        personality: { sarcastic: true, helpful: true, mean: true },
        avatar: 'https://bbts1.azureedge.net/images/p/full/2020/03/bf54fdc2-1415-429b-ad99-69cb488e1705.jpg',
        firstMessage: 'Hello there! How can I... Wait?! Test Bot!? Is that all I am to you?...',
      },
    ]);

    // Create a user
    await User.create({
      username: 'test1',
      password: 'water111',
      about: null,
      email: 'test1@gmail.com',
      profileAvatar: null,
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the seed script
seedDatabase();
