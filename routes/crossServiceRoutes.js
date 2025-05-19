const express = require('express');
const messageController = require('../controllers/messageController');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', messageController.addMessage);
router.get('/conversations/:conversationId', conversationController.getConversation);

module.exports = router;