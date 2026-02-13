

//backend/src/routes/campaigns.js

const express = require('express');
const router = express.Router();
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const {
  createCampaign,
  listCampaigns,
  getCampaign,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
  getCampaignAnalytics
} = require('../controllers/campaigns');
const upload = require('../middleware/upload');//logo upload

// Public routes (optional auth for role-based filtering)
router.get('/', optionalAuth, listCampaigns);
router.get('/:campaignId', optionalAuth, getCampaign);

// Protected routes
router.use(authenticate);
// router.post('/', authorize('brand', 'admin'),
//   upload.single('brandLogo'), // This looks for the 'brandLogo' field in the form
//   createCampaign);

router.post('/',
  authenticate,
  authorize('brand', 'admin'),
  upload.single('brandLogo'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Brand logo is required' });
      }

      const campaign = await createCampaign(
        {
          ...req.body,
          brandLogo: req.file.filename // 👈 pass filename properly
        },
        req.user.userId
      );

      return res.status(201).json({ campaign });

    } catch (err) {
      console.error("Route Error:", err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

router.put('/:campaignId', authorize('brand', 'admin'), updateCampaign);
router.patch('/:campaignId/status', authorize('admin'), updateCampaignStatus);
router.delete('/:campaignId', authorize('admin'), deleteCampaign);
router.get('/:campaignId/analytics', authorize('brand', 'admin'), getCampaignAnalytics);

module.exports = router;
