const express = require('express');
const router = express.Router();
const { chatbot, analyzeText } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatbot);
router.post('/analyze', protect, analyzeText);

module.exports = router;
