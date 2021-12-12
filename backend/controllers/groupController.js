const Group = require("../models/groupModel");
const User = require("../models/userModel");

const handleErrors = (err) => err;

module.exports.viewAllGroups = async (req, res) => {
  res.send(
    await Group.findById(req.params.id)
      .then((data) => data)
      .catch((err) => handleErrors(err))
  );
};


module.exports.createGroup = async (req, res) => {
  try {
    await User.findById(req.params.id).then(() => {
      Group.create({
        name: req?.body?.name,
        creator: req.params.id,
      });
    });
  } catch (err) {
    res.send(handleErrors(err));
  }
  res.send("group been made!");
};

module.exports.addToGroup = async (req, res) => {
  try {
    await Group.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { members: req.body.memberID } }
    );
    await User.findOneAndUpdate(
        { _id: req.body.memberID },
        { $addToSet: { groups: req.params.id } }
      );
  } catch (err) {
    res.send(handleErrors(err));
  }
  res.send("added successfully!");
};

module.exports.removeFromGroup = async (req, res) => {
    try {
        const group = await Group.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { members: req.body.memberID } }
        );
        await User.findOneAndUpdate(
            { _id: req.body.memberID },
            { $pull: { groups: req.params.id } }
          );
      } catch (err) {
        res.send(handleErrors(err));
      }
      res.send("removed successfully!");
};

module.exports.leaveGroup = async (req,res) => {
    try {
        const group = await Group.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { members: req.body.myID } }
        );
        await User.findOneAndUpdate(
            { _id: req.body.myID },
            { $pull: { groups: req.params.id } }
          );
      } catch (err) {
        res.send(handleErrors(err));
      }
      res.send("left successfully!");
}

module.exports.deleteGroup = async (req,res) => {
    try {
        const group = await Group.findOneAndDelete(
          { _id: req.params.id }
        );
        console.log('groupgroupgroup',group)
        await User.updateMany(
            { _id: {$in:group.members} },
            { $pull: { groups: req.params.id } }
          );
      } catch (err) {
        res.send(handleErrors(err));
      }
      res.send("deleted successfully!");
}
