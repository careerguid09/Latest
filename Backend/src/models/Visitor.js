const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  page: {
    type: String,
    default: '/counselor-dashboard'
  },
  visitedAt: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  }
});

// IMPORTANT: Unique index - Ek IP ek din mein sirf ek baar
visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;