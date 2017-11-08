// const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');


const admLogin = ( req, res ) => {
    res.render('admin/dashboard');
};

module.exports = {
    admDashboard: admDashboard
};
