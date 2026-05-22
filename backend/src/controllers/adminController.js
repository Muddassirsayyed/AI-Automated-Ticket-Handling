const User = require('../models/User');
const Ticket = require('../models/Ticket');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { role, isActive, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, department },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/agents - Get all agents for assignment
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true }).select('name email department');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser, getAgents };
