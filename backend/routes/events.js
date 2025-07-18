const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');

// Public routes
router.get('/', optionalAuth, getEvents);
router.get('/:id', optionalAuth, getEventById);

// Protected routes
router.post('/', authenticateToken, validateEvent, createEvent);
router.put('/:id', authenticateToken, validateEvent, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);
router.get('/my/events', authenticateToken, getMyEvents);

module.exports = router;