const express = require("express");
const {
  getFriends,
  addFriend,
  removeFriend
} = require("../controllers/friendController");
const router = express.Router();

router.get("/", getFriends);
router.post("/:userId", addFriend);
router.delete("/:userId", removeFriend);

module.exports = router;
