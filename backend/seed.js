const User = require('./models/User');
const sequelize = require('./database');

async function seed() {
    try {
      // Connect to the database
      await sequelize.authenticate();
      console.log('Connected to the database.');
  
      // Sync all models with the database
      await sequelize.sync();
      console.log('Models synchronized.');
  
      // Create test users
      const users = await User.bulkCreate([
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        { username: 'user3', password: 'password3' },
      ]);
  
      console.log('Test users created:', users);
    } catch (error) {
      console.error('Error seeding the database:', error);
    } finally {
      // Close the database connection
      await sequelize.close();
      console.log('Database connection closed.');
    }
  }
  
  seed();
  