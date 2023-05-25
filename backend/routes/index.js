const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const pictureRoutes = require('./pictures');

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pix', pictureRoutes);

module.exports = router;
