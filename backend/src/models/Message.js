const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isAI: { type: Boolean, default: false }, // true if message is AI-generated
  attachments: [{ filename: String, path: String }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
