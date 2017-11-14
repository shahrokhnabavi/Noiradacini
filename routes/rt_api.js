const express = require('express');
const router  = express.Router();
// Load Controllers
const Site  = require('../controllers/ctrl_site');

// Setting
router.get('/settings', Site.getSettings);

module.exports = router;
