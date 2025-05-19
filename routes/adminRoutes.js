const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/conversations', adminController.listConversations);
router.get('/conversations/:conversationId', adminController.getConversation);
router.delete('/conversations/:conversationId', adminController.deleteConversation);
router.get('/conversations/:conversationId/messages', adminController.getMessages);

module.exports = router;