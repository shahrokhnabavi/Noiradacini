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
    if( req.userAuth('/admin', true) ) return;

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

    // User.getByEmail(req.body.email).then(user => {
    User.findOne({email: req.body.email}).then(user => {
        if(user) {
            bcrypt.compare(req.body.passwd, user.password, function(err, result) {
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

// Validation To add or edit a user
var aValidate = () => {
    return [
            check('name', 'Please enter your full name.').not().isEmpty(),
            check('email', 'Your email is not valid').isEmail(),
            check('email', 'Your email is already exist, try another one.')
                //   .custom(value => User.getByEmail(value).then(user => !user)),
                  .custom(value => User.findOne({email: value}).then(user => !user)),
            check('passwd', 'Your password should be between 6 and 16 chars.')
                  .isLength({ min: 6, max: 16 }),
            check('conf_passwd', 'Your password and confirm are not matched.')
                  .custom( (value, {req}) => value === req.body.passwd)
        ];
};
var eValidate = () => {
    return [
            check('name', 'Please enter your full name.').not().isEmpty(),
            check('email', 'Your email is not valid').isEmail(),
            check('email', 'Your email is already exist, try another one.')
                //   .custom( (value, {req}) => User.getByEmailButNotSameId(value, req.params.id).then(user => !user)),
                  .custom( (value, {req}) => User.find({$and: [{ email: value },{_id:{'$ne':req.params.id }} ]})
                                                 .then(user => !user[0] )),
            check('passwd', 'Your password should be between 6 and 16 chars.')
                  .trim().custom( value => {
                      let len = value.length;
                      if( len === 0 ) return true;
                      if( len < 6 || len > 16)
                          return false;
                      else
                          return true;
                  }),
            check('conf_passwd', 'Your password and confirm are not matched.')
                  .custom( (value, {req}) => (value === req.body.passwd) )
        ];
};

// Add user
const add = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let data = {
            errors: errors.array(),
            request: req.body
        };
        return res.render('admin/users', data);
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.passwd, salt, function(err, hash) {
            let record = {
                name:   req.body.name,
                email:  req.body.email,
                password: hash
            };
            User.create( record )
                 .then( result => {
                     req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
                     res.redirect('/admin/user');
                 })
                 .catch( err => console.log(err) );
        });
    });
};

// edit user
const edit = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return User.getById(req.params.id)
        return User.findById(req.params.id)
            .then( user => {
                let data = {
                    errors: errors.array(),
                    request: req.body,
                    'item': user
                };
                return res.render('admin/users', data);
            })
            .catch( err => console.log(err) );
    }

    if( req.body.passwd ){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.passwd, salt, function(err, hash) {
                let record = {
                    name:   req.body.name,
                    email:  req.body.email,
                    password: hash
                };
                User.findByIdAndUpdate( req.params.id, record )
                     .then( result => {
                         req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
                         res.redirect('/admin/user/' + req.params.id);
                     })
                     .catch( err => console.log(err) );
            });
        });
    } else {
        let record = {
            name:   req.body.name,
            email:  req.body.email
        };
        User.findByIdAndUpdate( req.params.id, record )
             .then( result => {
                 req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
                 res.redirect('/admin/user/' + req.params.id);
             })
             .catch( err => console.log(err) );
    }
};

// Add Form User List
const admForm = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    if( req.params.id ){
        // User.getById(req.params.id)
        User.findById(req.params.id)
            .then( user => {
                res.render('admin/users', {success: req.getFlash('success'),'item': user} );
            })
            .catch( err => console.log(err) );
    } else
        res.render('admin/users', {success: req.getFlash('success')});
};

// User List
const admList = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    var page = Math.max(0, req.query.page ? parseInt(req.query.page) : 0);

    // User.getAll(10)
    User.find({})
        .select('-pageEditor')
        .limit(req.app.configs.admPerPage)
        .skip(req.app.configs.admPerPage * page)
        .sort('-createAt')
        .then(result => {
            User.count().then(function(count) {
                res.render('admin/users' , {
                        list: result,
                        page: page,
                        pages: count / req.app.configs.admPerPage,
                        row: page * req.app.configs.admPerPage,
                        success: req.getFlash('success')
                    });
                })
            })
        .catch(err => console.log(err));
};

// Delete User
const remove = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    User.findByIdAndRemove(req.params.id)
        .then( list => {
            res.redirect('/admin/users');
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
    addForm:   admForm,
    aValidate: aValidate(),
    edit:      edit,
    edtForm:   admForm,
    eValidate: eValidate(),
};
