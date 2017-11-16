// const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');


const browser = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/browser');
};

const admMedia = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/medias');
};

module.exports = {
    admMedia: admMedia,
    browser:  browser
};
