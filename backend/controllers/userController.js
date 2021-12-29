const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Friend = require("../models/friendModel");
const maxAge = 12 * 30 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign(
    { id },
    "*addskhk(*^%udkfIWHDIOh73ryg73&*^^bnj2356mkf8dg23fsg4>dsf<LP",
    { expiresIn: maxAge }
  );
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  const errors = [];
  if (err.code === 11000) {
    // console.log('key pattern and key value',err.keyPattern,Object.keys(err.keyValue)[0])
    Object?.keys(err.keyValue)[0] == "email"
      ? errors.push({
          message: "This email is already used",
          type: "unique",
          path: "email",
        })
      : Object?.keys(err.keyValue)[0] == "userName"
      ? errors.push({
          message: "This user name is used",
          type: "unique",
          path: "userName",
        })
      : "";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e) =>
      errors.push({
        message: e.properties.message,
        type: e.properties.type,
        path: e.properties.path,
        value: e.properties.value,
      })
    );
    console.log(errors);
  }
  return errors;
};

module.exports.create_user = async (req, res) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((data) => data)
    .catch((err) => "");
  if (user) {
    const token = createToken(user?._id);
    res.send(token);
  } else res.send("error creating account");
};
module.exports.log_user = async (req, res) => {
  try {
    console.log('log params',req.body.username, req.body.email, req.body.password)
    const user = await User.login(req.body.username, req.body.email, req.body.password)
    .then(data=>data).catch(err=>'');
    console.log('useruseruser',user)
    if(user){
    const token = createToken(user?._id);
    res.status(200).send(token);}
    else
    res.status(400).send('error')
  } catch (err) {
    res.send("sjaksfa");
  }
};

module.exports.get_all_users = async (req, res) => {
  res.send(
    await User.find({})
      .then((data) => data)
      .catch((err) => handleErrors(err))
  );
};

module.exports.get_user_from_token = async (req, res) => {
  const user = await User.findById(
    jwt.decode(
      req.params.id,
      "*addskhk(*^%udkfIWHDIOh73ryg73&*^^bnj2356mkf8dg23fsg4>dsf<LP"
    ).id
  )
    .then((data) => data)
    .catch((err) => {
      console.log("error1 at get user from token");
    });
    
  res.send(
      {
          _id:user?._id,
          userName:user?.userName,
          email:user?.email,
          friends:user?.friends,
          groups:user?.groups
        });
};


module.exports.get_username = async (req, res) => {
  console.log("////// ", req.params?.id);
  const user = await User.find({ userName: req.params?.id })
    .then((data) => data)
    .catch((err) => handleErrors(err));
  console.log("user to be searched is: ", user[0]);
  res.send(user[0]?.userName);
};


module.exports.delete_account = async (req, res) => {
  res.send(
    await User.findOneAndRemove({ _id: req.params.id })
      .then((data) => data)
      .catch((err) => handleErrors(err))
  );
};