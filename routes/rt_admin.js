const express = require('express');
const router  = express.Router();
// Load Controllers
const Users = require('../controllers/ctrl_users');
const Pages = require('../controllers/ctrl_pages');
const Site  = require('../controllers/ctrl_site');

// User Operations
router.get('/logout', Users.doLogout);
router.get('/login',  Users.admLogin);
router.post('/login', Users.lValidate(), Users.doLogin);
router.get('/user/add',        Users.admForm);
router.get('/user/delete/:id', Users.remove);
router.get('/user/:id',        Users.admForm);
router.get('/user',   Users.admList);
router.post('/user',  Users.rValidate(), Users.add);

// Setting
router.get('/setting', Site.admSetting);

// Dashboard
router.get('/', Pages.admDashboard);


module.exports = router;
