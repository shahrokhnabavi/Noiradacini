const express = require('express');
const router  = express.Router();

// Load Controllers
const Users = require('../controllers/ctrl_users');
const Pages = require('../controllers/ctrl_pages');
const Site  = require('../controllers/ctrl_site');
const Bundels  = require('../controllers/ctrl_bundels');


// Interview
router.get('/interview/:id', Bundels.show );

// Home page
router.get('/:page', (req, res) => {
    const Page = require('./models/mdl_page');
    Page.find({language: req.params.lang, slugName: req.params.page})
            .then(item=>{
                if( item && item.length === 1 )
                    res.render('page', item[0]);
                else
                    res.redirect('/');
            })
    .catch( err=> console.log(err) );
});

module.exports = router;
