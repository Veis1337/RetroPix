const { Sequelize } = require('sequelize');
const sequelize = require('./database');
const User = require('./models/User');
const Picture = require('./models/Picture');
const Comment = require('./models/Comment');
const Upvote = require('./models/Upvote');

const seedDatabase = async () => {
  try {
    // Drop the entire database schema
    await sequelize.drop({ force: true });

    // Recreate the database schema
    await sequelize.sync({ force: true });

    // Create new users
    await User.bulkCreate([
      {
        username: 'john_doe',
        password: 'password123',
        about: 'Hello, I am John Doe. Nice to meet you!',
        email: 'john@example.com',
      },
      {
        username: 'jane_smith',
        password: 'password456',
        about: 'Hi, I am Jane Smith. Welcome to my profile!',
        email: 'jane@example.com',
      },
    ]);

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
