const Setting = require('../models/mdl_site');
const {check, validationResult} = require('express-validator/check');


const getSettings = ( req, res ) => {

    Setting.getAll()
        .then( result => {
            var settings = {};
            result.forEach( item => {
                settings[item.setting_key] = item.setting_value
            })
            res.json(settings);
        });
};

const admSetting = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    Setting.getAll()
        .then( result => {
            var settings = {};
            result.forEach( item => {
                settings[item.setting_key] = item.setting_value
            })
            settings.success =  req.getFlash('success');
            res.render('admin/setting', settings);
        });
};

const save = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    let arrPromises = [];
    for(let key in req.body) {
        let pro = new Promise(function(resolve, reject) {
            Setting.getByField('setting_key', key).then( record => {
                req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
                if(record)
                {
                    Setting.findByIdAndUpdate(record.setting_id,{setting_value:req.body[key]}).then( resolve );
                }
                else
                {
                    Setting.create({setting_key:key, setting_value:req.body[key]}).then(resolve);
                }
            }).catch( err => console.log(err) );
        });
        arrPromises.push(pro);
    }
    Promise.all( arrPromises ).then( values => res.redirect('/admin/setting') )
};

module.exports = {
    getSettings: getSettings,
    admSetting: admSetting,
    save: save
};
