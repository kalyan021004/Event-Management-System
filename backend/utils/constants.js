
const EVENT_CATEGORIES = [
  'conference',
  'workshop',
  'seminar',
  'meetup',
  'webinar',
  'social',
  'sports',
  'cultural',
  'other'
];

const EVENT_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'cancelled'
];

const USER_ROLES = [
  'user',
  'admin'
];

const REGISTRATION_STATUSES = [
  'active',
  'cancelled',
  'waitlisted'
];

const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'refunded',
  'failed'
];

const ATTENDANCE_STATUSES = [
  'pending',
  'present',
  'absent'
];

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  maxLimit: 100
};

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again later.'
};

module.exports = {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  USER_ROLES,
  REGISTRATION_STATUSES,
  PAYMENT_STATUSES,
  ATTENDANCE_STATUSES,
  DEFAULT_PAGINATION,
  RATE_LIMIT_CONFIG
};