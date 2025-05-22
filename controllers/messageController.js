const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const AppError = require('../utils/appError');
const kafkaService = require('../services/kafkaService');

const allowedAttachmentTypes = ['image', 'video', 'file', 'audio', 'link'];

const processMessage = async ({senderType, senderId, content, attachments = [], conversationId, traceId}) => {

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const validatedAttachments = [];
    for (const att of attachments) {
      const { type, url } = att;

      if (!type || !url) {  
        throw new AppError('Each attachment must include type and url', 400);
      }

      if (!allowedAttachmentTypes.includes(type)) {
        throw new AppError(`Invalid attachment type: ${type}`, 400);
      } 

      validatedAttachments.push(att);
    }   

    const message = await Message.create({
      conversationId,
      senderType,
      senderId,
      content,
      attachments: validatedAttachments,
    });

    await kafkaService.sendMessage('NEW_MESSAGE', {message, traceId});
    return message;
};

const addMessage = async (req, res) => {
    const { senderType, senderId, content, attachments = [], conversationId } = req.getAllParams();

    const message = await processMessage({
      conversationId,
      senderType,
      senderId,
      content,
      attachments,
      traceId: req.traceId
    });

    return res.success(message);
};

const getMessages = async (req, res) => {
    const { conversationId, offset = 0, limit = 20 } = req.getAllParams();
    // check user has permission to access this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return res.success(messages.reverse());
};

module.exports = {
  addMessage,
  getMessages,
  processMessage,
};
