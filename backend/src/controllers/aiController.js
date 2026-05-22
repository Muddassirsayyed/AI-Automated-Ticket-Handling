const { generateChatbotResponse } = require('../services/aiService');

// POST /api/ai/chat
const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });
    const response = generateChatbotResponse(message);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/analyze
const analyzeText = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { analyzeTicket } = require('../services/aiService');
    const result = await analyzeTicket(title, description);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { chatbot, analyzeText };
