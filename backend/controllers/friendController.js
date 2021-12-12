const Friend = require("../models/friendModel");
const User = require("../models/userModel");

const handleErrors = (err) => err;

module.exports.viewAllRequests = async (req, res) => {
  res.send(
    await Friend.find({})
      .then((data) => data)
      .catch((err) => handleErrors(err))
  );
};



module.exports.sendRequest = async (req, res, next) => {
  let curr_status = true;
  let curr_response = "";

  if (req.body.from == req.body.to) {
    curr_response = "you can't send to yourself";
    curr_status = false;
  }

  User.findById(req.body.from)
    .then(() => {})
    .catch(() => {
      curr_response = "Your account DOESNT exist";
      curr_status = false;
    });

  User.findById(req.body.to)
    .then(() => {})
    .catch(() => {
      curr_response = "This user no longer exists";
      curr_status = false;
    });

  try {
  
    const request = await Friend.find(
      { $and: [{ from: req.body.from }, { to: req.body.to }, { status: 3 }] }
    ).then((data)=>data)
    .catch((err)=>{
      return Friend.findOneAndUpdate(
        { $and: [{ from: req.body.from }, { to: req.body.to }] },
        { $set: { status: 1 } },
        { upsert: true, new: true }
      ); 
    })
    
    if (curr_status)
      await User.findOneAndUpdate(
        { _id: req.body.from },
        { $addToSet: { friends: request._id } }
      )
        .then(() => {
          User.findOneAndUpdate(
            { _id: req.body.to },
            { $addToSet: { friends: request._id } }
          )
            .then(() => {})
            .catch((error) => {
              curr_response = error;
              curr_status = false;
            });
        })
        .catch((error) => {
          curr_response = error;
          curr_status = false;
        });
  } catch (err) {
    curr_response = curr_status ? err : curr_response;
    curr_status = false;
  }

  res.send(curr_status ? "curr_response" : handleErrors(curr_response));
};



module.exports.replayToRequest = async (req, res) => {
  try {
    if (req.body.replay === "accept") {
      Friend.findOneAndUpdate(
        {
          $and: [{ from: req.body.from }, { to: req.body.to }],
        },
        { $set: { status: 3 } }
      ).then(() => res.send("You have a new friend uWu"));
    } else if (req.body.replay === "reject") {
      const request = await Friend.findOneAndRemove({
        from: req.body.from,
        to: req.body.to,
      });
      await User.findOneAndUpdate(
        { _id: req.body.from },
        { $pull: { friends: request._id } }
      );
      await User.findOneAndUpdate(
        { _id: req.body.to },
        { $pull: { friends: request._id } }
      );
      res.send("friend request REJECTED");
      res.end();
    } else {
      res.send("wrong entry");
      res.end();
    }
  } catch (err) {
    res.send(err);
    res.end();
  }
};


module.exports.removeFriend = async (req, res) => {
  try {
    const request = await Friend.findOneAndRemove({
      from: req.body.myID,
      to: req.body.friendID,
    });
    await User.findOneAndUpdate(
      { _id: req.body.myID },
      { $pull: { friends: request._id } }
    );
    await User.findOneAndUpdate(
      { _id: req.body.friendID },
      { $pull: { friends: request._id } }
    );
    res.send("friend deleted");
    res.end();
  } catch (err) {
    res.send(err);
    res.end();
  }
};
