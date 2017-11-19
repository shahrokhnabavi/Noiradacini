const express = require('express');
const router  = express.Router();

// Load Controllers
const Site    = require('../controllers/ctrl_site');
const Bundels = require('../controllers/ctrl_bundels');
const Pages   = require('../controllers/ctrl_pages');

// Setting
router.get('/settings', Site.getSettings);

// Pages
router.get('/pages/:lang', Pages.apiGetPages);

// Bundels
router.get('/bundel/:id', Bundels.api_showBundel);
router.get('/bundels/:lang', Bundels.api_bundelsLocationAndName);
router.get('/bundel/:id/:lang', Bundels.api_listInProvince);

// Filter
router.post('/filter/admin/pages', Pages.apiFilter);

module.exports = router;
