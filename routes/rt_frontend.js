const express = require('express');
const router  = express.Router();

// Load Controllers
const Bundel = require('../models/mdl_bundel');
const Page = require('../models/mdl_page');
const Setting = require('../models/mdl_site');


// Interview
router.get('/:lang/interview/:id', (req , res ) => {
    const querystring = require('querystring');

    var host = req.protocol + '://' + req.get('host');
    Bundel.find({_id:req.params.id}).then(bundels => {
        Page.find({language: req.params.lang})
                .then(pages=>{
                    Setting.getAll()
                        .then( result => {
                            var settings = {};
                            result.forEach( item => {
                                settings[item.setting_key] = item.setting_value
                            })
                            res.render('frontend/interview',
                                        {
                                            item: bundels[0],
                                            fullUrl: host + req.originalUrl,
                                            encodedName: querystring.escape(bundels[0].name),
                                            personImage: querystring.escape(host + '/' + bundels[0].mainImage),
                                            pages: pages,
                                            settings: settings
                                        });
                        }).catch(err=>console.log(err));
                }).catch(err=>console.log(err));
    }).catch(err=>{
        console.log(err);
    });
});

// Home page
router.get('/:lang/:page', (req, res) => {
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
