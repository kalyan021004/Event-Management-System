
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { buildEventFilter } = require('../utils/helpers');

const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();
    await event.populate('organizer', 'username firstName lastName');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error creating event' });
  }
};

const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc',
      ...filterParams
    } = req.query;

    const filter = buildEventFilter(filterParams);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const events = await Event.find(filter)
      .populate('organizer', 'username firstName lastName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Server error fetching events' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username firstName lastName email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is registered (if authenticated)
    let userRegistration = null;
    if (req.user) {
      userRegistration = await Registration.findOne({
        user: req.user._id,
        event: req.params.id,
        status: 'active'
      });
    }

    res.json({
      event,
      userRegistration: userRegistration ? {
        id: userRegistration._id,
        status: userRegistration.status,
        registrationDate: userRegistration.registrationDate
      } : null
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ error: 'Server error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    // Reset approval status if not admin
    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      updateData.status = 'pending';
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'username firstName lastName');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Server error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    // Delete all registrations
    await Registration.deleteMany({ event: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error deleting event' });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { organizer: req.user._id };
    if (status) {
      filter.status = status;
    }

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('organizer', 'username firstName lastName');

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total
      }
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ error: 'Server error fetching your events' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents
};