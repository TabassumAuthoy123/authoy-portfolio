const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Achievement = require('../models/Achievement');
const Leadership = require('../models/Leadership');
const Article = require('../models/Article');
const GalleryItem = require('../models/GalleryItem');
const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');

// GET /api/analytics/dashboard — Admin only
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      projectsCount,
      skillsCount,
      experienceCount,
      achievementsCount,
      leadershipCount,
      articlesCount,
      galleryCount,
      totalMessages,
      unreadMessages,
      recentActivities,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Achievement.countDocuments(),
      Leadership.countDocuments(),
      Article.countDocuments(),
      GalleryItem.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    // Published vs draft articles
    const publishedArticles = await Article.countDocuments({ published: true });
    const draftArticles = articlesCount - publishedArticles;

    // Messages this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const messagesThisWeek = await Message.countDocuments({ createdAt: { $gte: weekAgo } });

    // Skills by category
    const skillsByCategory = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      stats: {
        projects: projectsCount,
        skills: skillsCount,
        experience: experienceCount,
        achievements: achievementsCount,
        leadership: leadershipCount,
        articles: {
          total: articlesCount,
          published: publishedArticles,
          draft: draftArticles,
        },
        gallery: galleryCount,
        messages: {
          total: totalMessages,
          unread: unreadMessages,
          thisWeek: messagesThisWeek,
        },
      },
      skillsByCategory,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/analytics/activity — Activity log
router.get('/activity', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(),
    ]);

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/analytics/log — Internal use (log an activity)
router.post('/log', auth, async (req, res) => {
  try {
    const log = await ActivityLog.create({
      ...req.body,
      ipAddress: req.ip,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
