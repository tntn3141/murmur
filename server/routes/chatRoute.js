const express = require("express");
const {
  createChat,
  findChat,
  findUserChats,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/find/:firstId/:secondId", findChat);
router.get("/:userId", findUserChats);

module.exports = router;
