const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');

// Validation for login
const validateLogin = () => {
    return [
            check('email', 'Your email is not valid').isEmail(),
            check('passwd', 'Your password should be between 6 and 16 chars.')
                  .isLength({ min: 6, max: 16 })
        ];
};

// Login form
const admLogin = ( req, res ) => {
    data = {
        errors: req.getFlash('errors')
    };
    res.render('admin/login', data);
};

// Login Operations
const doLogin = ( req, res ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/login', {errors: errors.array()});
    }

    User.getByEmail(req.body.email).then(user => {
        if(user) {
            bcrypt.compare(req.body.passwd, user.passwd, function(err, result) {
                if(result) {
                    req.session.user = user;
                    res.redirect('/admin');
                } else {
                    return res.render('admin/login', {errors: [{msg:'Your password is not currect.'}]});
                }
            });
        } else {
            return res.render('admin/login', {errors: [{msg:'Your email does not exist, please register.'}]});
        }
    });
};

// Logout Operation
const doLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};

// Validation To add a user
var validateRegister = () => {
    return [
            check('name', 'Please enter your full name.').not().isEmpty(),
            check('email', 'Your email is not valid').isEmail(),
            check('email', 'Your email is already exist, try another one.')
                  .custom(value => User.getByEmail(value).then(user => !user)),
            check('passwd', 'Your password should be between 6 and 16 chars.')
                  .isLength({ min: 6, max: 16 }),
            check('conf_passwd', 'Your password and confirm are not matched.')
                  .custom( (value, {req}) => value === req.body.passwd)
        ];
};

// Add user
const add = ( req, res ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('admin/users', {errors: errors.array()});
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.passwd, salt, function(err, hash) {
            let record = {
                name:   req.body.name,
                email:  req.body.email,
                passwd: hash
            };
            User.create( record )
                 .then( result => {
                     req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
                     res.redirect('/admin/user/add');
                 })
                 .catch( err => console.log(err) );
        });
    });
};

// Add Form User List
const admForm = ( req, res ) => {
    if( req.userAuth('/admin/login') )
        return;
    res.render('admin/users', {success: req.getFlash('success')});
};

// User List
const admList = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    User.getAll(10)
        .then( list => {
            data = {
                list: list,
                row: 0
            };
            res.render('admin/users', data);
        })
        .catch( err => console.log(err) );
};

// Delete User
const remove = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    User.remove(req.params.id)
        .then( list => {
            res.redirect('/admin/user');
        })
        .catch( err => console.log(err) );
};

module.exports = {
    admLogin:  admLogin,
    doLogin:   doLogin,
    doLogout:  doLogout,
    lValidate: validateLogin,
    admList:   admList,
    remove:    remove,
    add:       add,
    admForm:   admForm,
    rValidate: validateRegister,
};
