const User = require('./models/User');
const Picture = require('./models/Picture');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; 
const routes = require('./routes');

app.use('/api', routes);

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
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
