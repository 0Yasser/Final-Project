const mongoose = require ('mongoose')
var Schema = mongoose.Schema
const groupSchema = new mongoose.Schema({
    name: {
        type:String
    },
    creator: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    members: [{
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }]
},{timestamp:true})


const Group = mongoose.model('groups',groupSchema)
module.exports = Group