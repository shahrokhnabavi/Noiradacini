const express = require('express');
const router  = express.Router();

// Load Controllers
const Site  = require('../controllers/ctrl_site');

// Setting
router.get('/settings', Site.getSettings);

module.exports = router;


// Load Controllers
// const API = require('../controllers/ctrl_api');


// User Operations
// router.get('/bundels', API.interviewedLocation);
// router.get('/:id', API.listInProvince);
// router.get('/bundel/:id', API.showBundel);
// router.get('/pages', API.listOfPages);
