const User = require('../models/mdl_user');
const {check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');

const validateLogin = () => {
    return [
            check('email', 'Your email is not valid').isEmail(),
            check('passwd', 'Your password should be between 6 and 16 chars.')
                  .isLength({ min: 6, max: 16 })
        ];
};

const admLogin = ( req, res ) => {
    res.render('admin/login');
};

const doLogin = ( req, res ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.mapped()});
    }

    User.getByEmail(req.body.email).then(user => {
        if(user) {
            bcrypt.compare(req.body.passwd, user.passwd, function(err, result) {
                if(result) {
                    // req.session.user = user._id;

                    res.json(user);
                } else {
                    return res.status(422).json({
                        errors: {
                            'passwd': {
                                msg: 'Your password is not currect.'
                            }
                        }
                    });
                }
            });
        } else {
            return res.status(422).json({
                errors: {
                    'email': {
                        msg: 'Your email does not exist, please register.'
                    }
                }
            });
        }
    });
};

module.exports = {
    admLogin:  admLogin,
    doLogin:   doLogin,
    lValidate: validateLogin
};
