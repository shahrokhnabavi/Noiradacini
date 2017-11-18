const makepage  = require('../models/mdl_page');
const {check, validationResult} = require('express-validator/check');


const browser = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/browser');
};

const admMedia = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.render('admin/medias');
};

const admDashboard = ( req, res ) => {
    if( req.userAuth('/admin/login') ) return;
    res.redirect('/admin/bundels');
};


// Validation for adding pages
var validatePage = () => {
    return [
            check('language', 'Please enter the language.').not().isEmpty(),
            check('titleName', 'Please enter the title.').not().isEmpty(),
            check('slugName', 'Please enter the slug').not().isEmpty(),
            check('pageEditor', 'Your some value in the page editor.').not().isEmpty()
        ];
};

//make Page and save it into the database
const makePages = (req, res) =>{
  if( req.userAuth('/admin/login') ) return;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let data = {
        errors: errors.array()
    };
    res.render('admin/addPages', data)
  }
  else{

    let newPage = new makepage({
      language : req.body.language,
      titleName : req.body.titleName,
      slugName : req.body.slugName.replace(/\s+/g, '-').toLowerCase(),
      pageEditor : req.body.pageEditor
    });
    newPage.save().then(newPagel =>{
      req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}]);
      res.redirect('/admin/dynamicPage')
    })
    .catch(err =>{
      res.end('You have error in making the page')
    })

  }

}

const showPages = (req ,res)=>{
    if( req.userAuth('/admin/login') ) return;
    makepage.find({})
    .then(item=>{
    res.render('admin/pages', {listItems : item, success: req.getFlash('success')});
    })
    .catch(err=>{
      res.end('there is error');
    })
}

const addDynamicPages = (req, res)=>{
  if( req.userAuth('/admin/login') ) return;
  res.render('admin/addPages', {success: req.getFlash('success')})
}

const deletePage = (req,res) =>{
  if( req.userAuth('/admin/login') ) return;
  makepage.findByIdAndRemove(req.params.id)
      .then( list => {
          res.redirect('/admin/pages');
      })
      .catch( err => console.log(err) );
}

const editPage = (req,res) =>{
  if( req.userAuth('/admin/login') ) return;
  makepage.findById(req.params.id)
  .then(
    result => {
      req.setFlash('success', [{'msg': 'Your information has been submitted successfully.'}])
      res.render('admin/pages', {pageResult : result})
    }
  )
}

const editPage2 = (req,res)=>{
  if( req.userAuth('/admin/login') ) return;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    makepage.findById(req.params.id)
    .then(
      result => {
        let data = {
            errors: errors.array(),
            pageResult : result
        };
        res.render('admin/pages', data)
      }
    )
  }
  else{
    let record = {
      language : req.body.language,
      titleName : req.body.titleName,
      slugName : req.body.slugName.replace(/\s+/g, '-').toLowerCase(),
      pageEditor : req.body.pageEditor
    };
    makepage.findByIdAndUpdate( req.params.id, record, {new: true}  ).then( rec => {
      data = {
        success: req.getFlash('success'),
        pageResult : rec
      }
      res.render('admin/pages', data );
    }).catch( err => console.log(err) );
  }
}


const apiGetPages = (req ,res)=>{
    makepage.find({language: req.params.lang}).select('titleName slugName -_id')
            .then(item=>{
                res.json(item);
            })
    .catch( err=> console.log(err) );
}

module.exports = {
    admMedia: admMedia,
    browser:  browser,
    admDashboard: admDashboard,
    apiGetPages: apiGetPages,

    showPages:showPages,
    addDynamicPages:addDynamicPages,
    makePages:makePages,
    validatePage:validatePage(),
    deletePage:deletePage,
    editPage:editPage,
    editPage2:editPage2
};
