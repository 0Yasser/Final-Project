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
  let response_message = "";
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((data) => data)
    .catch((err) => {
      response_message = err;
      return "";
    });
  if (user) {
    const token = createToken(user?._id);
    res.status(200).send(token);
  } else {
    res.status(400).send(handleErrors(response_message));
  }
};

module.exports.log_user = async (req, res) => {
  // console.log('log params',req.body.username, req.body.email, req.body.password)
  let response_message = "";
  const user = await User.login(
    req.body?.username,
    req.body?.email,
    req.body.password
  )
    .then((data) => data)
    .catch((err) => {
      console.log("loginlogin", err);
      response_message = err;
      return "";
    });
  console.log("useruseruser", user);
  if (user) {
    const token = createToken(user?._id);
    res.status(200).send(token);
  } else res.status(400).send(response_message);
};

module.exports.get_all_users = async (req, res) => {
  res.send(
    await User.find({})
      .then((data) => data)
      .catch((err) => handleErrors(err))
  );
};

module.exports.get_user_details = async (req, res) => {
  let response_message = "";
  const id = await jwt.decode(
    req.params.token,
    "*addskhk(*^%udkfIWHDIOh73ryg73&*^^bnj2356mkf8dg23fsg4>dsf<LP"
  )?.id;
  if (id) {
    let user = await User.findById(id)
      .then((data) => data)
      .catch((err) => {
        response_message = err;
        console.log(
          "///////////\nerror1 at get user from token\n//////////",
          err
        );
      });

    res.status(200).send({
      _id: user?._id,
      userName: user?.userName,
      email: user?.email,
      friends: user?.friends,
      groups: user?.groups,
    });
  } else {
    res.status(400).send("unvalid token");
  }
};

module.exports.get_username = async (req, res) => {
  console.log("////// ", req.params?.username);
  const user = await User.find({ userName: req.params?.username })
    .then((data) => data)
    .catch((err) => {
      console.log("error at get_username function (user route):", err);
      return "";
    });
  // console.log("user to be searched is: ", user[0]);
  if (user) res.status(200).send(user[0]?.userName);
  else res.status(400).send("no results");
};


// This one (delete_account) is not finished
module.exports.delete_account = async (req, res) => {
  let response_message = "";
  const id = await jwt.decode(
    req.params.token,
    "*addskhk(*^%udkfIWHDIOh73ryg73&*^^bnj2356mkf8dg23fsg4>dsf<LP"
  )?.id;
  if (id) {
    const user = await User.findOneAndRemove({ _id: id })
      .then((data) => data)
      .catch((err) => "");
      if(user){
        // await Friend.deleteMany({$or:[{from:user._id},{to:user._id}]})
        // await Group.deleteMany({$and:[{$in:members},{to:user._id}]})
        // await User.deleteMany({$or:[{from:user._id},{to:user._id}]})
      }
    
    if (user) res.status(200).send(user);
    else res.status(400).send("could not delete account");
  } else {
    res.status(400).send("unvalid token");
  }
};
