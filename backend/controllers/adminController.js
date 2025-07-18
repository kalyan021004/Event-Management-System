const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

const getPendingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const events = await Event.find({ status: 'pending' })
      .populate('organizer', 'username firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments({ status: 'pending' });

    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total
      }
    });
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ error: 'Server error fetching pending events' });
  }
};

const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', updatedAt: new Date() },
      { new: true }
    ).populate('organizer', 'username firstName lastName email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event approved successfully',
      event
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ error: 'Server error approving event' });
  }
};

const rejectEvent = async (req, res) => {
  try {
    const { reason } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected', 
        rejectionReason: reason,
        updatedAt: new Date() 
      },
      { new: true }
    ).populate('organizer', 'username firstName lastName email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event rejected successfully',
      event
    });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ error: 'Server error rejecting event' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error updating user role' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Server error deactivating user' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      pendingEvents,
      totalRegistrations,
      recentEvents,
      recentUsers
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'active' }),
      Event.find().sort({ createdAt: -1 }).limit(5).populate('organizer', 'username firstName lastName'),
      User.find({ isActive: true }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        pendingEvents,
        totalRegistrations
      },
      recentEvents,
      recentUsers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
};

module.exports = {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getDashboardStats
};
