// const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');


const admSetting = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/setting');
};

module.exports = {
    admSetting: admSetting
};
