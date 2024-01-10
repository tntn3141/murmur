const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  userId: String,
  friends: Array
})

const friendModel = mongoose.model("friend", friendSchema)

module.exports = friendModel