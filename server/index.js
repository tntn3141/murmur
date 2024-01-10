const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const friendRoute = require("./routes/friendRoute");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/friends", friendRoute);

app.listen(PORT, (req, res) => {
  console.log(`Server currently running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB, { dbName: "murmur" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.log("Failed to connect to MongoDB. ", error.message)
  );
