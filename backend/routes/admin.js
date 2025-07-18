
const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getDashboardStats
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/events/pending', getPendingEvents);
router.put('/events/:id/approve', approveEvent);
router.put('/events/:id/reject', rejectEvent);
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/deactivate', deactivateUser);

module.exports = router;