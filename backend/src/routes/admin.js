const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getAgents } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/agents', getAgents);

module.exports = router;
