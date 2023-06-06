const { Sequelize } = require('sequelize');

const devConfig = {
  user: process.env.DB_USER,
  password: 'water111',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

// Deployment
function getProdConfig() {
  // we have to parse url string that heroku updates
  const dbUrl = new URL(process.env.DATABASE_URL); // URL is a class is JS for this
  return {
    user: dbUrl.username,
    password: dbUrl.password,
    host: dbUrl.host,
    database: dbUrl.pathname.replace("/", ""), // it's the /do8.... we have to remove the slash though
    dialect: 'postgres',
  };
}


const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? getProdConfig() : devConfig
);

module.exports = sequelize;