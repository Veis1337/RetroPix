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
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(cors({ origin: 'https://retro-pix.herokuapp.com/' }));
app.use(bodyParser.json());

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

// Serve static files for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
