const Friend = require("../models/friendModel");
const User = require("../models/userModel");

const handleErrors = (err) => err;

// module.exports.viewAllRequests = async (req, res) => {
//   res.send(
//     await Friend.find({})
//       .then((data) => data)
//       .catch((err) => handleErrors(err))
//   );
// };

// The body of sendRequest() contains :
// 1- myUsername
// 2- theirUsername

module.exports.getMyFriends = async (req, res) => {
  const user = await User.findById(req.params.id)
    .then((data) => {
      console.log("getMyFriends user", data);
      return data;
    })
    .catch((err) => "");

  const friends = await Friend.find({
    $and: [{ _id: { $in: user?.friends } }, { status: 3 }],
  })
    .then((data) => {
      console.log("getMyFriends friend", data);
      return data.map((e) =>
        e.from.toString() == user._id.toString() ? e.to : e.from
      );
    })
    .catch((err) => "");
  console.log("getMyFriends friends on outside", friends);
  const actualFriends = await User.find({
    _id: { $in: friends },
  })
    .then((data) => {
      console.log("getMyFriends actual friends"); //, data[0]);
      return data;
    })
    .catch((err) => "");
  console.log(
    "getMyFriends last thing",
    actualFriends.map((e, i) => {
      return { userName: e.userName, email: e.email };
    })
  );
  res.status(200).send(
    actualFriends.map((e) => {
      return { userName: e?.userName, email: e?.email };
    })
  );
};

module.exports.getRecievedFriendRequests = async (req, res) => {
  const user = await User.findById(req.params.id)
    .then((data) => {
      // console.log("user", data[0]);
      return data;
    })
    .catch((err) => "");

  const friends = await Friend.find({
    $and: [{ _id: { $in: user?.friends } }, { to: user?._id }, { status: 1 }],
  })
    .then((data) => {
      // console.log("friend", data[0]);
      console.log("friends dot map", data.map((e) => e?.from)[0]);
      return data;
    })
    .catch((err) => "");
  const requester = await User.find({
    _id: { $in: friends.map((e) => e?.from) },
  })
    .then((data) => {
      // console.log("friend requests", data[0]);
      return data;
    })
    .catch((err) => "");
  res.status(200).send(requester.map((e) => e?.userName));
};

module.exports.getRequestID = async (req, res) => {
  let meAndFriendUsernames = req.params.usernames.split('-_-:-_-')
  meAndFriendUsernames[0]=await User.find({userName:meAndFriendUsernames[0]}).then(data=>data[0]).catch(err=>'')
  meAndFriendUsernames[1]=await User.find({userName:meAndFriendUsernames[1]}).then(data=>data[0]).catch(err=>'')

  console.log('me and not me',meAndFriendUsernames)
  const friendAsFriendRequest = await Friend.find({
    $or: [
      { $and: [{ to: meAndFriendUsernames[0]._id }, { from: meAndFriendUsernames[1]._id }] },
      { $and: [{ from: meAndFriendUsernames[0]._id }, { to: meAndFriendUsernames[1]._id }] },
    ],
  })
    .then((data) => {
      console.log('getRequestID',data[0])
      return data[0]})
    .catch((err) => {
      console.log('getRequestID error')
      return {}});
  friendAsFriendRequest
    ? res.status(200).send(friendAsFriendRequest._id)
    : res.status(400).send("");
};
module.exports.sendRequest = async (req, res, next) => {
  console.log("sendrequest", req.body.myUsername, req.body.theirUsername);
  let curr_status = true;
  let curr_response = "";

  const myID = await User.find({ userName: req.body.myUsername })
    .then((data) => data[0]._id)
    .catch(() => {
      curr_response = "Your account DOESNT exist";
      curr_status = false;
      return "";
    });

  const theirID = await User.find({ userName: req.body.theirUsername })
    .then((data) => data[0]._id)
    .catch(() => {
      curr_response = "This user no longer exists";
      curr_status = false;
      return "";
    });

  if (req.body.myUsername == req.body.theirUsername) {
    curr_response = "you can't send to yourself";
    curr_status = false;
  }
  console.log("from", myID, "\nTo", theirID);

  if (curr_status)
    try {
      const request = await Friend.find({
        $and: [{ from: myID }, { to: theirID }],
      })
        .then((data) => {
          curr_response =
            data[0].statue == 3
              ? "You already a friend"
              : "You already sent a friend request";
          curr_status = false;
          return data[0];
        })
        .catch(() => {
          return Friend.findOneAndUpdate(
            { $and: [{ from: myID }, { to: theirID }] },
            { $set: { status: 1 } },
            { upsert: true, new: true }
          );
        });

      if (curr_status) {
        await User.findOneAndUpdate(
          { _id: myID },
          { $addToSet: { friends: request._id } }
        );
        await User.findOneAndUpdate(
          { _id: theirID },
          { $addToSet: { friends: request._id } }
        );
      }
    } catch (err) {
      curr_response = curr_status ? err : curr_response;
      curr_status = false;
    }
  res.send(curr_status ? "curr_response" : handleErrors(curr_response));
};

// The body of replayToRequest() contains :
// 1- replay (either "accept or "reject")
// 2- myUsername
// 3- theirUsername
module.exports.replayToRequest = async (req, res) => {
  console.log("replay to request");
  let curr_status = true;
  let curr_response = "";
  const myID = await User.find({ userName: req.body.myUsername })
    .then((data) => data[0]._id)
    .catch(() => {
      curr_response = "Your account DOESNT exist";
      curr_status = false;
      return "";
    });

  const theirID = await User.find({ userName: req.body.theirUsername })
    .then((data) => data[0]._id)
    .catch(() => {
      console.log("thier id error");
      curr_response = "This user no longer exists";
      curr_status = false;
      return "";
    });

  if (curr_status)
    try {
      if (req.body.replay === "accept") {
        Friend.findOneAndUpdate(
          {
            $and: [{ from: theirID }, { to: myID }],
          },
          { $set: { status: 3 } }
        ).then(() => {
          curr_response = "You have a new friend uWu";
        });
      } else if (req.body.replay === "reject") {
        const request = await Friend.findOneAndRemove({
          from: theirID,
          to: myID,
        });
        await User.findOneAndUpdate(
          { _id: myID },
          { $pull: { friends: request._id } }
        );
        await User.findOneAndUpdate(
          { _id: theirID },
          { $pull: { friends: request._id } }
        );
        curr_response = "friend request REJECTED";
      } else {
        curr_response = "wrong entry";
      }
    } catch (err) {
      res.send(err);
    }
  res.send(curr_response);
};

// The body of removeFriend() contains :
// 2- myID
// 3- friendID
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
