require('dotenv').config();
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
    username: dbUrl.username,
    password: dbUrl.password,
    host: dbUrl.hostname,
    port: dbUrl.port,
    database: dbUrl.pathname.replace("/", ""), // it's the /path.... we have to remove the slash though
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // accept self-signed from heroku
      }
    },
  };
}


const sequelize = new Sequelize(
  process.env.NODE_ENV === 'production' ? getProdConfig() : devConfig
);

// const sequelize = new Sequelize(
//   process.env.NODE_ENV === 'production' ? getProdConfig() : getProdConfig()
// );

module.exports = sequelize;