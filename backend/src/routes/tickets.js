const express = require('express');
const router = express.Router();
const { getTickets, getTicket, createTicket, updateTicket, deleteTicket, getStats } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/analytics/stats', protect, authorize('admin', 'agent'), getStats);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicket);
router.post('/', protect, upload.array('attachments', 5), createTicket);
router.put('/:id', protect, authorize('admin', 'agent'), updateTicket);
router.delete('/:id', protect, authorize('admin'), deleteTicket);

module.exports = router;
