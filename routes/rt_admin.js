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
router.get('/preview/:id',  Bundels.showPreview);
router.post('/bundel/:id', Bundels.addValidate, Bundels.editBundel);
router.post('/bundel', Bundels.addValidate,Bundels.makeBundel);
router.get('/bundel', Bundels.viewBundel);
router.get('/bundels', Bundels.bundles )

//Media manager Routes
router.get('/medias',  Pages.admMedia);
router.get('/browser', Pages.browser);
router.get('/', Pages.admDashboard );

// Pages
router.get('/dynamicPage', Pages.addDynamicPages);
router.post('/makePage', Pages.validatePage ,Pages.makePages);
router.post('/updatePage/:id', Pages.validatePage, Pages.editPage2)
router.get('/pages/delete/:id', Pages.deletePage);
router.get('/pages/:id', Pages.editPage)
router.get('/pages', Pages.showPages);

module.exports = router;
