const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical Issue', 'Billing', 'Account Access', 'Feature Request', 'General Query'],
    default: 'General Query'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ filename: String, path: String, mimetype: String }],
  aiSuggestion: { type: String, default: '' },
  aiConfidence: { type: Number, default: 0 }, // 0-100 confidence score
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative', 'Frustrated'], default: 'Neutral' },
  department: { type: String, default: 'General Support' },
  timeline: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  tags: [String],
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
