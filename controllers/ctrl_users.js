const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');

const admLogin = ( req, res ) => {
    // do validate
    if( req.body.email ){
        User.checkLogin(req.body, (err, result ) => {
            console.log(result);
        });
        res.end();
    } else {
        res.render('admin/login');
    }
};

module.exports = {
    admLogin: admLogin
};
