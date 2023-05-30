const { Sequelize } = require('sequelize');
require('dotenv').config();

const devConfig = {
  user: process.env.DB_USER,
  password: 'water111',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

const proConfig = {
  connectionString: process.env.DATABASE_URL,
};

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? proConfig : devConfig
);

module.exports = sequelize;
