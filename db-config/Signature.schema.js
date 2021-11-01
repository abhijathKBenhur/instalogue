const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Catalogue = new Schema(
    {
        
        categories: { type: String},
        postURL: { type: String },
        profileURL90: { type: String},
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Catalogue', Catalogue)