const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const buildEventFilter = (params) => {
  const {
    date,
    location,
    category,
    status = 'approved',
    startDate,
    endDate,
    search,
    organizer,
    isVirtual,
    priceMin,
    priceMax
  } = params;

  const filter = { status };

  // Date filtering
  if (date) {
    const searchDate = new Date(date);
    filter.date = {
      $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
      $lt: new Date(searchDate.setHours(23, 59, 59, 999))
    };
  }

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Location filtering
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }

  // Category filtering
  if (category) {
    filter.category = category;
  }

  // Organizer filtering
  if (organizer) {
    filter.organizer = organizer;
  }

  // Virtual event filtering
  if (isVirtual !== undefined) {
    filter.isVirtual = isVirtual === 'true';
  }

  // Price filtering
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = parseFloat(priceMin);
    if (priceMax) filter.price.$lte = parseFloat(priceMax);
  }

  // Search filtering
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  return filter;
};

const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return response;
};

const calculateEventDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  const diff = end - start;
  return Math.round(diff / (1000 * 60)); // Return duration in minutes
};

module.exports = {
  generateToken,
  buildEventFilter,
  formatResponse,
  calculateEventDuration
};