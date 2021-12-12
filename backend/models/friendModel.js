const mongoose = require ('mongoose')
var Schema = mongoose.Schema
const friendSchema = new mongoose.Schema({
    from: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    to: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
      }
},{timestamp:true})


const Friend = mongoose.model('friendRequests',friendSchema)
module.exports = Friend