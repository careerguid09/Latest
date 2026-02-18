const express = require('express');
const Visitor = require('../models/Visitor.js');

// AGAR protect middleware nahi hai to comment out karo
// const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Temporary middleware for testing (agar protect nahi hai)
const protect = (req, res, next) => {
  // For testing - allow all requests
  next();
};

// @desc    Track page visit
// @route   POST /visitors/track
// @access  Private
router.post('/track', protect, async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const userAgent = req.headers['user-agent'];
    const userId = req.user?._id || null;
    
    // Check if yeh IP aaj pehle aaya hai?
    const existingVisitor = await Visitor.findOne({
      ip: ip,
      date: today
    });

    if (!existingVisitor) {
      await Visitor.create({
        ip,
        userAgent,
        userId,
        date: today,
        page: req.body.page || '/counselor-dashboard'
      });
      console.log(`✅ New unique visitor today: ${ip}`);
    }

    // Get counts
    const totalAllTime = await Visitor.countDocuments();
    const todayUnique = await Visitor.countDocuments({ date: today });

    res.status(200).json({
      success: true,
      message: existingVisitor ? 'Returning visitor' : 'New visitor',
      stats: {
        totalAllTime,
        todayUnique
      }
    });
    
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

// @desc    Get visitor stats
// @route   GET /visitors/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalAllTime = await Visitor.countDocuments();
    const todayUnique = await Visitor.countDocuments({ date: today });
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = await Visitor.countDocuments({ date: dateStr });
      last7Days.push({
        date: dateStr,
        unique: count
      });
    }

    res.status(200).json({
      success: true,
      totalAllTime,
      todayUnique,
      weeklyData: last7Days
    });
    
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ error: 'Failed to get visitor stats' });
  }
});

// @desc    Get today's visitors
// @route   GET /visitors/today
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayUnique = await Visitor.countDocuments({ date: today });

    res.status(200).json({
      success: true,
      todayUnique
    });
    
  } catch (error) {
    console.error('Error getting today\'s visitors:', error);
    res.status(500).json({ error: 'Failed to get today\'s visitors' });
  }
});

module.exports = router;