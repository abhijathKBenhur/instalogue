const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Catalogue = new Schema(
    {
        
        category: { type: String},
        subCategory: { type: String},
        thumbnailURL: { type: String },
        postURL: { type: String },
        storeName: { type: String},
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Catalogue', Catalogue)