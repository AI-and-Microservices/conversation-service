const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['system_chatbot', 'application'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  promptKey: {
    type: String,
    required: function () {
      return this.mode === 'system_chatbot';
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
