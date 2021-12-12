const User = require('../models/userModel')

const handleErrors = err => {
    console.log(err.message, err.code)
    const errors = []
    if(err.code===11000){
        // console.log('key pattern and key value',err.keyPattern,Object.keys(err.keyValue)[0])
        Object?.keys(err.keyValue)[0]=='email'?errors.push({"message": "This email is already used",
        "type": "unique",
        "path": "email"}):
        Object?.keys(err.keyValue)[0]=='userName'?errors.push({"message": "This user name is used",
        "type": "unique",
        "path": "userName"}):
        ""
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(e=>errors.push({message: e.properties.message,
            type:e.properties.type,
            path:e.properties.path,
            value:e.properties.value}))
            console.log(errors)
    }
    return errors
}

module.exports.get_all_users = async (req,res) => {
    res.send(await User.find({}).then(data=>data).catch(err=>handleErrors(err)))
}

module.exports.create_user = async (req,res) => {
    res.send(await User.create({
        userName:req.body.userName,
        email:req.body.email,
        password:req.body.password
    }).then(data=>data).catch(err=>handleErrors(err)))
}

module.exports.delete_account = async (req,res) => {
    res.send(await User.findOneAndRemove({_id:req.body.myID}).then(data=>data).catch(err=>handle(err)))
}


