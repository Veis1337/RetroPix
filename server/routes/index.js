const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const pictureRoutes = require('./pictures');
const commentRoutes = require('./comments');
const botRoutes = require('./bots'); 

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pix', pictureRoutes);
router.use('/comments', commentRoutes);
router.use('/bots', botRoutes); 

module.exports = router;
