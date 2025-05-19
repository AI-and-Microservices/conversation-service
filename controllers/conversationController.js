const Conversation = require('../models/Conversation');
const AppError = require('../utils/appError');

exports.createConversation = async (req, res) => {
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
};

exports.listConversations = async (req, res) => {
    const userId = req.user.id;
    const conversations = await Conversation.find({ userId });
    return res.success(conversations);
};

exports.getConversation = async (req, res) => {
    const { conversationId } = req.getAllParams();
    const userId = req.user.id;
    const conversation = await Conversation.findOne({ _id: conversationId, userId });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    return res.success(conversation);
};

