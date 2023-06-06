const express = require('express');
const path = require('path');

const staticConfig = (app) => {
  // Serve static files from the "client/build" directory
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Handle requests for any other routes by serving the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
};

module.exports = staticConfig;
