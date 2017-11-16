const express = require('express');
const router  = express.Router();

// Load Controllers
const Site    = require('../controllers/ctrl_site');
const Bundels = require('../controllers/ctrl_bundels');

// Setting
router.get('/settings', Site.getSettings);

// Bundels
router.get('/bundel/:id', Bundels.api_showBundel);
router.get('/bundels/:lang', Bundels.api_bundelsLocationAndName);
router.get('/:id/:lang', Bundels.api_listInProvince);

module.exports = router;
