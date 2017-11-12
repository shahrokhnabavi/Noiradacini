const Setting = require('../models/mdl_site');
const {check, validationResult} = require('express-validator/check');


const admSetting = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    Setting.getAll()
        .then( result => {
            var settings = {};
            result.forEach( item => {
                settings[item.setting_key] = item.setting_value
            })
            res.render('admin/setting', settings);
        });
};

const save = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    // Setting.getByField(req.)
    let arrPromises = [];
    for(key in req.body) {
        let pro = new Promise(function(resolve, reject) {
            Setting.getByField('setting_key', key).then( record => {
                if(record){
                    console.log(req.body[key]);
                    Setting.findByIdAndUpdate(record.setting_id,{setting_value:req.body[key]})
                    .catch(err=>console.log(err));
                } else {
                    console.log('CREATE');
                }
            }).catch( err => console.log(err) );
        });
        // arrPromises.push();
    }
    // Promise.all( arrPromises ).then( values => res.redirect('/admin/setting') )
    res.end();
};

module.exports = {
    admSetting: admSetting,
    save: save
};
