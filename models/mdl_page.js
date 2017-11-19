const mongoose = require('mongoose');


// make a Schema
const pageSchema = mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    titleName: {
        type: String,
        required: true
    },
    slugName: {
        type: String,
        required: true
    },
    pageEditor:{
        type: String,
        required: true
    },
    createAt:{
      type: Date,
      required: false,
      default: Date.now
    }
});

module.exports = mongoose.model('pages', pageSchema);
