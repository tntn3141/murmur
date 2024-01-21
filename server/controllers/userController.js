const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const uploadImage = require("../utils/uploadImage");
const getBase64 = require("../utils/getBase64");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let avatarLink = "";
    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json("This email is already in use.");
    }
    if (!name || !email || !password) {
      return res.status(400).json("User information is missing.");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Email is invalid.");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password is insecure.");
    }

    if (req.file) {
      // Convert file object to base64 string
      const encoded = req.file.buffer.toString("base64");
      // Upload to imgbb
      avatarLink = await uploadImage(encoded);
    }

    user = new userModel({ name, email, password, avatar: avatarLink });
    const bcryptSalt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, bcryptSalt);
    await user.save();

    const token = createToken(user._id);
    res
      .status(200)
      .json({
        _id: user._id,
        name,
        email,
        avatar,
        createdAt: user.createdAt,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Incorrect email or password.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Incorrect email or password.");
    }

    const token = createToken(user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      avatar: user.avatar,
      token,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    const { _id, name, email, avatar } = user;
    res.status(200).json({ _id, name, email, avatar });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserByEmail = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const user = await userModel.findOne({ email: userEmail });
    if (user) {
      const { _id, name, email, avatar } = user;
      res.status(200).json({ _id, name, email, avatar });
    } else {
      res.status(404).json("No user with such email found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.file) {
      const encoded = req.file.buffer.toString("base64");
      const avatarLink = await uploadImage(encoded);
      req.body.avatar = avatarLink;
      console.log("avatar", avatarLink)
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );
    console.log("user", updatedUser)
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: probably implement soft-deletion instead
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("The account has been deleted.");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUserById,
  findUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
};
