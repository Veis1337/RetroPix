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
    // Delete all data from all tables
    await Promise.all([
      User.destroy({ where: {} }),
      Picture.destroy({ where: {} }),
      Comment.destroy({ where: {} }),
      Upvote.destroy({ where: {} }),
      Bot.destroy({ where: {} }),
    ]);

    // Drop the entire database schema
    await sequelize.queryInterface.dropAllTables();

    // Recreate the database schema
    await sequelize.sync({ force: true });

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
