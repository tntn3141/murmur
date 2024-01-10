const friendModel = require("../models/friendModel");

const getFriends = async (req, res) => {
  const { _id } = req.body;
  try {
    const response = await friendModel.findOne({userId: _id})
    res.status(200).json(response.friends)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

const addFriend = async (req, res) => {
  const { _id } = req.body;
  const { friendId } = req.params
  try {
    const friendList = await friendModel.findOne({userId: _id})
    console.log("friendList", friendList)
    if (!friendList.friends.includes(friendId)) {
      friendList.friends.push(friendId);
      const response = await friendModel.save()
      res.status(200).json(response.friends);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

const removeFriend = async (req, res) => {
  const { _id } = req.body;
  const { friendId } = req.params;
  try {
    const { friends } = await friendModel.findOne({userId: _id});
    const index = friends.indexOf(friendId);
    if (index > -1) {
      friends.splice(index, 1)
    }
    const response = await friends.save()
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

module.exports = { getFriends, addFriend, removeFriend }