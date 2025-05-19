const express = require('express');
const conversationRoutes = require('./conversations');
const messageRoutes = require('./messages');

const router = express.Router();

router.use('/conversations/:conversationId/messages/', messageRoutes);
router.use('/conversations/', conversationRoutes);



module.exports = router;