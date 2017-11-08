const express = require('express');
const router  = express.Router();
const Users = require('../controllers/ctrl_users');

router.get('/login',  Users.admLogin);
router.post('/login', Users.lValidate(), Users.doLogin);
router.get('/',  Users.admDashboard);


module.exports = router;
