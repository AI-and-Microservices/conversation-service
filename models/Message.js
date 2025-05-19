const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'file', 'audio', 'link'],
    required: true,
  },
  url: { type: String, required: true },
  name: String,
  mimeType: String,
  size: Number,
  platformData: mongoose.Schema.Types.Mixed,
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  senderType: {
    type: String,
    enum: ['user', 'function', 'virtual_role'],
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [attachmentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
