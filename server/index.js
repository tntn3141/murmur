const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Multer = require("multer");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const friendRoute = require("./routes/friendRoute");

const PORT = process.env.PORT || 5000;

const app = express();

const baseUrl = "http://localhost:5173";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 24 * 1024 * 1024,
    fieldSize: 2 * 1024 * 1024
  }
})

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: baseUrl
}));
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": baseUrl,
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'nonce-random123' 'strict-dynamic' 'unsafe-inline' https:; object-src 'none'; base-uri 'none';",
  });
  next();
});
/* The <string> in multer.single(<string>) dictates how the front end 
sends the image to the server (the key in the FormData has to match <string>) */
app.use(multer.single("image"));

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
