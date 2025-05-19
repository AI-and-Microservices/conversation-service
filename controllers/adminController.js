const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AppError = require('../utils/appError');

exports.createConversation = async (req, res) => {
  try {
    const { mode, applicationId, promptId } = req.getAllParams();
    const userId = req.user.id;

    if (!['system_chatbot', 'application'].includes(mode)) {
      throw new AppError('Invalid mode', 400);
    }

    const conversation = await Conversation.create({
      mode,
      userId,
      applicationId: mode === 'application' ? applicationId : undefined,
      promptId,
    });

    return res.success(conversation);
  } catch (err) {
    return res.error(err, 500);
  }
};

exports.listConversations = async (req, res) => {
  try {
    const { offset = 0, limit = 10 } = req.getAllParams();
    const conversations = await Conversation.find().skip(offset).limit(limit);
    return res.success(conversations);
  } catch (err) {
    return res.error(err, 500);
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.getAllParams();
    const conversation = await Conversation.findOne({ _id: conversationId });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    return res.success(conversation);
  } catch (err) {
    return res.error(err, 500);
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.getAllParams();
    await Conversation.deleteOne({ _id: conversationId });
    return res.success({ message: 'Conversation deleted successfully' });
  } catch (err) {
    return res.error(err, 500);
  }
};

// get messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.getAllParams();
    const messages = await Message.find({ conversationId });
    return res.success(messages);
  } catch (err) {
    return res.error(err, 500);
  }
};


