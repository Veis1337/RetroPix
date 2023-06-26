const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const pictureRoutes = require('./pictures');
const commentRoutes = require('./comments');

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pix', pictureRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
