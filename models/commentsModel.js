const mongoose = require('mongoose')
const { type } = require('os')

const commentSchema = new mongoose.Schema({
    recipeID:{
        type:String,
        require:true,

    },
    userId : {
        type : String,
        required : true,
    },

    comments : {
        type : String,
        require:true,
    }

})
const comments = mongoose.model('comments', commentSchema);

module.exports = comments;
