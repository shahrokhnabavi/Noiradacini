const bundel = require('../models/mdl_bundel');
const {check, validationResult} = require('express-validator/check');

const viewBundel = (req , res ) => {
    if( req.userAuth('/admin/login') ) return;
    var title = "Plugin Imagebrowser ckeditor for nodejs"
    res.render('admin/bundel', { result: 'result' })
}

const makeBundel = (req , res ) => {
    if( req.userAuth('/admin/login') ) return;

    let newBundel = new bundel({
      name:         req.body.bundelName,
      bundelEditor: req.body.bundelEditor ,
      publishDate: req.body.publishDate,
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

    bundel.find({}).select(' -bundelEditor').sort('-createAt').then(result=>{
      res.render('admin/bundleDisplay' , {result, success: req.getFlash('success')} );
    }).catch(err =>{
      res.json(err)
      console.log(err + "error in show bundels list");
    })

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
        let record = {
          name:         req.body.bundelName,
          bundelEditor: req.body.bundelEditor ,
          publishDate: req.body.publishDate,
          frontEndDesc: req.body.frontEndDesc,
          province:     req.body.province,
          language:     req.body.language,
          udateAt:       Date(Date.now()),
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


module.exports = {
    viewBundel: viewBundel,
    makeBundel: makeBundel,
    bundles: bundles,
    api_showBundel: showBundel,
    api_listInProvince: listInProvince,
    api_bundelsLocationAndName:bundelsLocationAndName,
    showEditBundel: showEditBundel,
    remove: remove,
    editBundel: editBundel,
};
