const Registration = require('../models/Registration');
const Event = require('../models/Event');
const mongoose = require('mongoose');

const registerForEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(req.params.id).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Event not found' });
    }

    // Validation checks
    if (event.status !== 'approved') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Event is not approved for registration' });
    }

    if (new Date(event.date) < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot register for past events' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: req.params.id,
      status: 'active'
    }).session(session);

    if (existingRegistration) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    // Check capacity
    if (event.currentRegistrations >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Event is fully booked' });
    }

    // Create registration
    const registration = new Registration({
      user: req.user._id,
      event: req.params.id,
      notes: req.body.notes
    });

    await registration.save({ session });

    // Update event registration count
    await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentRegistrations: 1 } },
      { session }
    );

    await session.commitTransaction();
    
    await registration.populate([
      { path: 'user', select: 'username firstName lastName email' },
      { path: 'event', select: 'title date time location' }
    ]);

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  } finally {
    session.endSession();
  }
};

const cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const registration = await Registration.findOne({
      _id: req.params.registrationId,
      user: req.user._id,
      status: 'active'
    }).session(session);

    if (!registration) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Registration not found' });
    }

    const event = await Event.findById(registration.event).session(session);
    
    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot cancel registration for past events' });
    }

    // Update registration status
    registration.status = 'cancelled';
    await registration.save({ session });

    // Update event registration count
    await Event.findByIdAndUpdate(
      registration.event,
      { $inc: { currentRegistrations: -1 } },
      { session }
    );

    await session.commitTransaction();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel registration error:', error);
    res.status(500).json({ error: 'Server error cancelling registration' });
  } finally {
    session.endSession();
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;

    const filter = { user: req.user._id };
    if (status !== 'all') {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('event', 'title description date time location capacity currentRegistrations organizer')
      .populate('event.organizer', 'username firstName lastName')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRegistrations: total
      }
    });
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({ error: 'Server error fetching registrations' });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;

    // Check if user is organizer or admin
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view registrations' });
    }

    const filter = { event: req.params.id };
    if (status !== 'all') {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('user', 'username firstName lastName email phone')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRegistrations: total
      }
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ error: 'Server error fetching event registrations' });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations
};
