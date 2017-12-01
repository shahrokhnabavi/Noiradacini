const Setting = require('../models/mdl_site');
const {check, validationResult} = require('express-validator/check');


const getSettings = ( req, res ) => {

    // Setting.getAll()
    Setting.find()
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

    // Setting.getAll()
    Setting.find()
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

    let arrPromises = [ new Promise(function(resolve, reject) {
        Setting.find({'setting_key': 'site_use_theme'}).then( record => {
            let val = req.body.site_use_theme ? 'on' : 'off';
            if(record.length)
            {
                Setting.findByIdAndUpdate(record[0]._id,{setting_value:val}).then( result => resolve(1) );
            }
            else
            {
                let setting = new Setting({
                  setting_key : 'site_use_theme',
                  setting_value : val
                });
                setting.save().then(result => resolve(1)).catch(err => console.log(err));
            }
        }).catch( err => console.log(err) );
    }) ];

    for(let key in req.body) {

        let pro = new Promise(function(resolve, reject) {
            Setting.find({'setting_key': key}).then( record => {
                if(record.length)
                {
                    Setting.findByIdAndUpdate(record[0]._id,{setting_value:req.body[key]}).then( result => resolve(1) );
                }
                else
                {
                    let setting = new Setting({
                      setting_key : key,
                      setting_value : req.body[key]
                    });
                    setting.save().then(result => resolve(1)).catch(err => console.log(err));
                }
            }).catch( err => console.log(err) );
        });
        arrPromises.push(pro);
    }
    Promise.all( arrPromises ).then( values => {
        req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
        res.redirect('/admin/setting')
    })
};

module.exports = {
    getSettings: getSettings,
    admSetting: admSetting,
    save: save
};
