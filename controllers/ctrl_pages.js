// const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');


const admDashboard = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/setting');
};

const admMedia = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/medias');
};

module.exports = {
    admMedia: admMedia,
    admDashboard: admDashboard
};
