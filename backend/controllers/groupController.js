const Group = require("../models/groupModel");
const User = require("../models/userModel");

const handleErrors = (err) => err;


module.exports.getGroup = async (req,res) => {
  res.send(await Group.findById(req.params.id).then(data=>data).catch(err=>""))
}

module.exports.createGroup = async (req, res) => {

  let message = "group-created!";
  let state = true;

  let user = await User.findById(req.params.id)
    .then((data) => data)
    .catch(() => {
      message = "wrong ID!";
      state = false;
    });

  console.log("user is", user);

  let group = state
    ? await Group.create({
        name: req.body.name,
        creator: req.params.id,
        members: req.params.id,
      })
        .then((data) => data)
        .catch((err) => {
          message = err;
          state = false;
        })
    : "";
  console.log("group is", group);

  if (state)
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { groups: group._id } }
    )
      .then(() => {})
      .catch(() => {
        message = "Failed to delete the group from user side!";
      });

  res.send(group);
};

module.exports.deleteGroup = async (req, res) => {
  let curr_response = "deleted successfully!",
    curr_status = true;
    console.log('req.params.id',req.params.id,'myID',req.body.myID)
  const group = await Group.findOneAndDelete({
    $and: [{ _id: req.params.id }, { creator: req.body.myID }],
  })
    .then((data) => data)
    .catch(() => {
      curr_response = "cant delete group1";
      curr_status = false;
      return "";
    });
  console.log("group is", group);
  if (group && curr_status)
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: req.params.id } }
    )
      .then(() => {
        console.log("updated successfully");
      })
      .catch(() => {
        curr_response = "couldnt remove group from users";
      });
  else curr_response = "cant delete group2";
  const user = User.findById(req.params.id).then(data=>data).catch(err=>"")
  res.status(200).send(user);
  res.end();
  
};

module.exports.viewMyGroups = async (req, res) => {
  const user = await User.findById(req.params.id)
  .then((data)=>{
    // console.log('user',data)
    return data})
    .catch(err=>"")
  
  const group = await Group.find({_id:{$in:user?.groups}})
  .then((data)=>{
    // console.log('group',data)
    return data
  })
  .catch(err=>'')
  res.send(group)
  // res.send(
  //   await Group.findById(req.params.id)
  //     .then((data) => data)
  //     .catch((err) => handleErrors(err))
  // );
};


module.exports.addToGroup = async (req, res) => {
  console.log('rea.params.id',req.params.id)
  let curr_response = "Added successfully",
    curr_status = true;
  const memberID = await User.find({ userName: req.body.memberUsername })
    .then((data) => data[0]?._id)
    .catch(() => {
      (curr_response = "unvalid username"), (curr_status = false);
      return "";
    });
  await Group.findById(req.params.id)
    .then((data) => {
      if (data == null) {
        curr_response = "Group doesnt exists";
        curr_status = false;
      }
    })
    .catch(() => {
      curr_response = "Group doesnt exists";
      curr_status = false;
    });

  if (curr_status)
    await Group.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { members: memberID } }
    )
      .then(() => {})
      .catch((err) => {
        curr_status = false;
        curr_response = "Failed at adding new user in group document";
        console.log("error catched at removing user from group: ", err);
      });
  if (curr_status)
    await User.findOneAndUpdate(
      { _id: memberID },
      { $addToSet: { groups: req.params.id } }
    )
      .then(() => {})
      .catch((err) => {
        curr_response = "failed at adding new group in user document";
        console.log("error catched at removing user from group: ", err);
      });

  res.send(curr_response);
};


module.exports.removeFromGroup = async (req, res) => {
  let curr_response = "removed successfully",
    curr_status = true;

  const memberID = await User.find({ userName: req.body.memberUsername })
    .then((data) => data[0]?._id)
    .catch(() => {
      curr_response = "unvalid username";
      curr_status = false;
      return "";
    });

  if (req.body.myID == memberID) {
    curr_response = "You cant remove yourself";
    curr_status = false;
  }

  await User.findById(req.body.myID)
    .then((data) => {
      if (data == null) {
        curr_response = "You are not allowed remove user from this group1";
        curr_status = false;
      }
    })
    .catch(() => {
      curr_response = "You are not allowed remove user from this group2";
      curr_status = false;
    });

  await Group.findById(req.params.id)
    .then((data) => {
      if (!data) {
        curr_response = "unvalid group ID1";
        curr_status = false;
      }
    })
    .catch(() => {
      curr_response = "unvalid group ID2";
      curr_status = false;
    });

  if (curr_status) {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { members: memberID } }
    )
      .then((data) => data)
      .catch(() => {});
    await User.findOneAndUpdate(
      { _id: memberID },
      { $pull: { groups: req.params.id } }
    )
      .then(() => {})
      .catch(() => {});
    if (group?.members?.length == 1) {
      await Group.findByIdAndRemove(group._id)
        .then(() => {})
        .catch(() => {
          curr_response = "couldnt remove group entirely";
        });
    }
  }
  res.send(curr_response);
};

module.exports.leaveGroup = async (req, res) => {
  let curr_response = "left successfully";
  const group = await Group.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { members: req.body.myID } }
  )
    .then((data) => data)
    .catch(() => {
      curr_response = "Group doesnt exists";
    });

  await User.findOneAndUpdate(
    { _id: req.body.myID },
    { $pull: { groups: req.params.id } }
  )
    .then((data) => data)
    .catch(() => {
      curr_response = "You already left";
    });
  if (group?.members?.length == 1) {
    await Group.findByIdAndRemove(group._id)
      .then(() => {})
      .catch(() => {
        curr_response = "couldnt remove group entirely";
      });
  }

  res.send(curr_response);
};


