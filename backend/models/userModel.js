const mongoose = require ('mongoose')
const {isEmail} = require('validator')
const {isAlphanumeric} = require('validator')
var Schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique:true,
        trim:true,
        required: [true,'Please enter a user name'],
        validate:[isAlphanumeric,"username should be contain only letters and numbers"]
    }
    ,
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique:true,
        trim:true,
        lowercase: true,
        validate:[isEmail,"email should be in a correct format"]
    }
    ,
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,"password should be larger than 5"],
        maxlength: [20,"password should be smaller than 21"]
    }
    ,
    friends: [{
        type: Schema.Types.ObjectId, ref: 'friendRequests'
    }]
    ,
    groups: [{
        type: Schema.Types.ObjectId, ref: 'groups'
    }]
},{timestamp:true})


const User = mongoose.model('user',userSchema)
module.exports = User