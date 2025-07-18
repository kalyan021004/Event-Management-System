const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations
} = require('../controllers/registrationController');

// All routes require authentication
router.post('/events/:id/register', authenticateToken, registerForEvent);
router.put('/:registrationId/cancel', authenticateToken, cancelRegistration);
router.get('/my', authenticateToken, getMyRegistrations);
router.get('/events/:id', authenticateToken, getEventRegistrations);

module.exports = router;