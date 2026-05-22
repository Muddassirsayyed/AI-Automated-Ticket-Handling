const Message = require('../models/Message');
const Ticket = require('../models/Ticket');

// GET /api/messages/:ticketId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages/:ticketId
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text required' });

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const message = await Message.create({
      ticketId: req.params.ticketId,
      sender: req.user._id,
      text
    });

    // Update ticket status to In Progress when agent replies
    if (req.user.role === 'agent' && ticket.status === 'Open') {
      await Ticket.findByIdAndUpdate(req.params.ticketId, { status: 'In Progress' });
    }

    await message.populate('sender', 'name email role');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage };
