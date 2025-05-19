const express = require('express');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router.post('/', conversationController.createConversation);
router.get('/', conversationController.listConversations);
router.get('/:id', conversationController.getConversation);

module.exports = router;