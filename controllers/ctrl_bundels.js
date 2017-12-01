const bundel = require('../models/mdl_bundel');
const {check, validationResult} = require('express-validator/check');
const Setting = require('../models/mdl_site');
const Page = require('../models/mdl_page');

const viewBundel = (req , res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/bundel', { result: 'result' })
}

var addValidate = () => {
    return [
            check('bundelName',   'Please enter Name of interviewee.').not().isEmpty(),
            check('dateOfBirth', 'Please enter date of birth.').not().isEmpty(),
            check('placeOfBirth', 'Please enter place of birth.').not().isEmpty(),
            check('occupation',   'Please enter Occupation.').not().isEmpty(),
            check('bundelEditor', 'Please enter Interview.').not().isEmpty(),
            check('publishDate',  'Please enter Publish Date.').not().isEmpty(),
            check('frontEndDesc', 'Please enter Short Description.').not().isEmpty(),
            check('province',     'Please enter Province.').not().isEmpty(),
            check('language',     'Please enter Language.').not().isEmpty(),
            check('mainImage',    'Please enter Interviewee Photo.').not().isEmpty(),
            check('audio',        'Please enter Interview Audio File.').not().isEmpty()
        ];
};

const makeBundel = (req , res ) => {
    if( req.userAuth('/admin/login') ) return;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let data = {
            errors: errors.array(),
            request: req.body
        };
        return res.render('admin/bundel', data);
    }

    let newBundel = new bundel({
      name:         req.body.bundelName,
      bundelEditor: req.body.bundelEditor ,
      dateOfBirth:  new Date(req.body.dateOfBirth),
      publishDate:  new Date(req.body.publishDate),
      placeOfBirth: req.body.placeOfBirth,
      occupation:   req.body.occupation,
      frontEndDesc: req.body.frontEndDesc,
      province:     req.body.province,
      language:     req.body.language,
      mainImage:    req.body.mainImage,
      audio:        req.body.audio
    });

    newBundel.save().then(newBundel=>{
        req.setFlash('success', [{'msg': 'The interview has been submitted successfully.'}]);
        res.redirect('/admin/bundels')
    })
    .catch(err=>{
      res.end('You have error in making bundel!!!')
    })
}

// bundle display
const bundles = (req ,res)=>{
    if( req.userAuth('/admin/login') ) return;

    var page = Math.max(0, req.query.page ? parseInt(req.query.page) : 0);

    bundel.find({})
        .select('-bundelEditor')
        .limit(req.app.configs.admPerPage)
        .skip(req.app.configs.admPerPage * page)
        .sort('-createAt')
        .then(result => {
            bundel.count().then(function(count) {
                res.render('admin/bundleDisplay' , {
                        result,
                        page: page,
                        pages: count / req.app.configs.admPerPage,
                        row: page * req.app.configs.admPerPage,
                        success: req.getFlash('success')
                    });
                })
            .catch(err => console.log(err));
        });
}

// remove bundel
const remove = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;

    bundel.findByIdAndRemove(req.params.id)
        .then( list => {
            res.redirect('/admin/bundels');
        })
        .catch( err => console.log(err) );
};

// edit a bundel
const showEditBundel = (req , res) => {
    if( req.userAuth('/admin/login') ) return;

    if( req.params.id ){
        bundel.findById(req.params.id)
            .then( oneBundel => {
                res.render('admin/bundel', {success: req.getFlash('success'),'item': oneBundel } );
            })
            .catch( err => console.log(err) );
    } else
        res.render('admin/bundels', {success: req.getFlash('success')});

}

const editBundel = (req , res) => {
    if( req.userAuth('/admin/login') ) return;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return bundel.findById(req.params.id)
            .then( user => {
                let data = {
                    errors: errors.array(),
                    request: req.body,
                    'item': user
                };
                return res.render('admin/bundel', data);
            })
            .catch( err => console.log(err) );
    }
    let record = {
        name:         req.body.bundelName,
        bundelEditor: req.body.bundelEditor ,
        publishDate:  new Date(req.body.publishDate),
        dateOfBirth:  new Date(req.body.dateOfBirth),
        placeOfBirth: req.body.placeOfBirth,
        occupation:   req.body.occupation,
        frontEndDesc: req.body.frontEndDesc,
        province:     req.body.province,
        language:     req.body.language,
        udateAt:      Date(Date.now()),
        mainImage:    req.body.mainImage,
        audio:        req.body.audio
    };

    bundel.findByIdAndUpdate( req.params.id, record )
          .then( result => {
              req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
              res.redirect('/admin/bundels');
          })
          .catch( err => console.log(err) );

}

const bundelsLocationAndName= (req , res ) => {
      let provinceList = [{province:'NL-DR',count:[] }, {province:'NL-FR',count:[]},
                          {province:'NL-GE',count:[]}, {province:'NL-GR',count:[]},
                          {province:'NL-OV',count:[]}, {province:'NL-NH',count:[]},
                          {province:'NL-UT',count:[]}, {province:'NL-LI',count:[]},
                          {province:'NL-NB',count:[]}, {province:'NL-ZE',count:[]},
                          {province:'NL-FL',count:[]}, {province:'NL-ZH',count:[]}
                        ];
          var dataNotSend=[];
          provinceList.forEach(function(item, index){
            var temp =  new Promise( (resolve, reject) => {
                bundel.find({$and:[{province: item.province},{language:req.params.lang}, {publishDate:{$lt: Date.now()}  }  ]})
                .select('name -_id').then(name=>{
                      provinceList[index].count = name.length ;
                      resolve(1);
                })
              });
              dataNotSend.push(temp);
          })
          Promise.all( dataNotSend ).then(() => {res.json(provinceList)})
        .catch(err=>{
            res.end('You have error in list of locations!!!')
      })
}

const listInProvince= (req , res ) => {
    // id of the province
    bundel.find({$and:[{province:req.params.id }, {language:req.params.lang},{publishDate:{$lt: Date.now() } }]}).select(' -bundelEditor')
    .then(result =>{ res.json(result)
    }).catch(err=>{
      res.end('You have error in list province!!!')
    })


}

const showBundel= (req , res ) => {
    // id of the bundel
    bundel.find({_id:req.params.id }).then(result =>{
      res.json(result)
    }).catch(err=>{
      res.end('You have error in showBundel!!!')
    });
}

const showPreview =(req , res ) => {
      // id of the bundel
      if( req.userAuth('/admin/login') ) return;
      const querystring = require('querystring');
      var host = req.protocol + '://' + req.get('host');
      bundel.find({_id:req.params.id }).then(bundel =>{
        Setting.find()
            .then( result => {
                var settings = {};
                result.forEach( item => {
                    settings[item.setting_key] = item.setting_value
                })
                res.render('admin/interviewAdmin',
                            {
                                item: bundel[0],
                                fullUrl: host + req.originalUrl,
                                encodedName: querystring.escape(bundel[0].name),
                                personImage: querystring.escape(host + '/' + bundel[0].mainImage),

                                settings: settings
                            });
            }).catch(err=>console.log(err));
      }).catch(err=>{ console.log(err);
        res.end('You have error in show preview!!!')
      });

}


module.exports = {
    viewBundel: viewBundel,
    makeBundel: makeBundel,
    addValidate: addValidate(),
    bundles: bundles,
    api_showBundel: showBundel,
    api_listInProvince: listInProvince,
    api_bundelsLocationAndName:bundelsLocationAndName,
    showEditBundel: showEditBundel,
    remove: remove,
    editBundel: editBundel,
    showPreview: showPreview,
};
