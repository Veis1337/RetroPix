const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const picturesRouter = require('./pictures');

router.use('/users', usersRouter);
router.use('/pix', picturesRouter);

module.exports = router;
