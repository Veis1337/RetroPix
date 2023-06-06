const { Sequelize } = require('sequelize');

const devConfig = {
  user: process.env.DB_USER,
  password: 'water111',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  // port: process.env.DB_PORT,
  dialect: 'postgres',
};

// Deployment
const proConfig = {
  connectionString: process.env.DATABASE_URL,
  dialect: 'postgres',
};

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? proConfig : devConfig
);

module.exports = sequelize;
