const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Catalogue = new Schema(
    {
        
        category: { type: String},
        postURL: { type: String },
        profileURL: { type: String},
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Catalogue', Catalogue)