const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const AppError = require('../utils/appError');
const kafkaService = require('../services/kafkaService');

const allowedAttachmentTypes = ['image', 'video', 'file', 'audio', 'link'];

exports.processMessage = async ({senderType, senderId, content, attachments = [], conversationId}) => {

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

    await kafkaService.sendMessage('NEW_MESSAGE', message);
    return message;
};

exports.addMessage = async (req, res) => {
    const { senderType, senderId, content, attachments = [], conversationId } = req.getAllParams();

    const message = await processMessage({
      conversationId,
      senderType,
      senderId,
      content,
      attachments,
    });

    return res.success(message);
};

exports.getMessages = async (req, res) => {
    const { conversationId, page = 1, limit = 20 } = req.getAllParams();

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.success(messages);
};
