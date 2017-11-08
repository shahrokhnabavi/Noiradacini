const express = require('express');
const router  = express.Router();
const Users = require('../controllers/ctrl_users');

router.get('/login',  Users.admLogin);
router.post('/login', Users.admLogin);
// router.post('',    Users.add);
// router.put('/:id', Users.validate(), Users.edit);
// router.delete('/:id', Users.remove);

module.exports = router;
