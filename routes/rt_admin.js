const express = require('express');
const router  = express.Router();

// Load Controllers
const Users = require('../controllers/ctrl_users');
const Pages = require('../controllers/ctrl_pages');
const Site  = require('../controllers/ctrl_site');
const Bundels  = require('../controllers/ctrl_bundels');

// User Operations
router.get('/logout', Users.doLogout);
router.get('/login',  Users.admLogin);
router.post('/login', Users.lValidate(), Users.doLogin);

router.get('/user/delete/:id', Users.remove);
router.get('/user',      Users.addForm);
router.post('/user',     Users.aValidate, Users.add);
router.get('/user/:id',  Users.edtForm);
router.post('/user/:id', Users.eValidate, Users.edit);
router.get('/users',     Users.admList);

// Setting
router.get('/setting',  Site.admSetting);
router.post('/setting', Site.save);

// Bundels
router.get('/bundel/delete/:id', Bundels.remove);
router.get('/bundels/:id',  Bundels.showEditBundel);
router.post('/bundel/:id',  Bundels.editBundel);
router.post('/bundel', Bundels.makeBundel);
router.get('/bundel', Bundels.viewBundel);
router.get('/bundels', Bundels.bundles )

//Media manager Routes
router.get('/medias', Pages.admMedia);
// router.get('/bundel/files', Pages.showImage);
// router.post('/bundel/delete_file', Pages.deleteImage)

module.exports = router;
