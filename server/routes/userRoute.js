const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  findUserById,
  findUserByEmail,
  getUsers,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/findById/:userId", findUserById);
router.get("/", getUsers);
/* Here POST is used instead of GET so that the email can be included 
in the req body, because passing emails in params seems icky */
router.post("/findByEmail", findUserByEmail);

module.exports = router;
