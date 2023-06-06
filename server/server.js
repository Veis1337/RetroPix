const User = require('./models/User');
const Picture = require('./models/Picture');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;
const routes = require('./routes');

const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log(dotenv);

async function syncDatabase() {
  try {
    await User.sync();
    await Picture.sync();
    console.log('Database models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database models:', error);
  }
}

syncDatabase();

// Middleware
// app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
// }

// Proxy middleware
// Proxy middleware
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : 'http://localhost:5000',
    changeOrigin: true,
  })
);


// Routes
app.use(routes);

// Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

app.listen(process.env.PORT || 5000, () => {
  console.log(`server has started on port ${process.env.PORT || 5000}`)
})