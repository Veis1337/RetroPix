const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('retropix_db', 'postgres', 'water111', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

module.exports = sequelize;
