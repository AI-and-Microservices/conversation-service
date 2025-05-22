const express = require('express');
const messageController = require('../controllers/messageController');

// mergeParams: true for get params from parent router
const router = express.Router({ mergeParams: true });

router.post('/', messageController.addMessage);
router.get('/', messageController.getMessages);

module.exports = router;