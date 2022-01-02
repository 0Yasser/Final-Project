const mongoose = require ('mongoose')
const {isEmail} = require('validator')
const {isAlphanumeric} = require('validator')
const bcrypt = require('bcrypt')
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


userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
  });

  userSchema.statics.login = async function(username,email,password) {
    //   console.log('login params',username,password,email)
    const authorByEmail = await this.findOne({email:email});
    const authorByUsername = await this.findOne({userName:username});
    // console.log('userByEmail,userByUsername in userSchema.statics.login equals',authorByEmail,authorByUsername)
    if(authorByEmail){
        const auth = await bcrypt.compare(password,authorByEmail.password)
        if(auth){
            return authorByEmail
        }
        else
        throw('incorrect password')
    }else if(authorByUsername){
        const auth = await bcrypt.compare(password,authorByUsername.password)
        if(auth){
            return authorByUsername
        }
        else
        throw('incorrect password')
    }else
    throw('incorrect username or email')
}


const User = mongoose.model('user',userSchema)
module.exports = User