const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { analyzeTicket } = require('../services/aiService');
const { sendEmail, emailTemplates } = require('../services/emailService');

// GET /api/tickets - Get tickets based on role
const getTickets = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 10 } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'user') query.createdBy = req.user._id;
    else if (req.user.role === 'agent') query.assignedTo = req.user._id;
    // admin sees all

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tickets, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tickets/:id
const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('timeline.performedBy', 'name');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Access control
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tickets - Create ticket with AI analysis
const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });

    // AI Analysis
    const aiResult = await analyzeTicket(title, description);

    // Auto-assign to available agent in the department
    const agent = await User.findOne({ role: 'agent', isActive: true });

    const attachments = req.files?.map(f => ({
      filename: f.originalname,
      path: f.path,
      mimetype: f.mimetype
    })) || [];

    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
      assignedTo: agent?._id || null,
      attachments,
      ...aiResult,
      timeline: [{ action: 'Ticket created', performedBy: req.user._id }]
    });

    await ticket.populate('createdBy', 'name email');

    // Send email notification
    const { subject, html } = emailTemplates.ticketCreated(ticket);
    await sendEmail({ to: req.user.email, subject, html });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tickets/:id - Update ticket
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const { status, assignedTo, priority, category } = req.body;
    const updates = {};

    if (status) {
      updates.status = status;
      if (status === 'Resolved') updates.resolvedAt = new Date();
      updates.$push = { timeline: { action: `Status changed to ${status}`, performedBy: req.user._id } };
    }
    if (assignedTo) updates.assignedTo = assignedTo;
    if (priority) updates.priority = priority;
    if (category) updates.category = category;

    const updated = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tickets/:id - Admin only
const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tickets/analytics/stats - Dashboard stats
const getStats = async (req, res) => {
  try {
    const [total, open, inProgress, resolved, byCategory, byPriority, bySentiment] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: 'Resolved' }),
      Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$sentiment', count: { $sum: 1 } } }])
    ]);

    // Tickets over last 7 days
    const last7Days = await Ticket.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ total, open, inProgress, resolved, byCategory, byPriority, bySentiment, last7Days });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTickets, getTicket, createTicket, updateTicket, deleteTicket, getStats };
