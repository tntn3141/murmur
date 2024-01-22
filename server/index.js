const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Multer = require("multer");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const PORT = process.env.PORT || 3000;
const baseUrl = "https://murmur-chat.netlify.app";

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 24 * 1024 * 1024,
    fieldSize: 2 * 1024 * 1024,
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: baseUrl,
  })
);
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": baseUrl,
    // "Access-Control-Allow-Headers":
    //   "Origin, X-Requested-With, Content-Type, Accept",
    // "Content-Security-Policy":
    //   "default-src 'self'; script-src 'nonce-random123' 'strict-dynamic' 'unsafe-inline' https:; object-src 'none'; base-uri 'none';",
  });
  next();
});
/* The <string> in multer.single(<string>) dictates how the front end 
sends the image to the server (the key in the FormData from the client 
has to match <string>) */
app.use(multer.single("image"));

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

mongoose
  .connect(process.env.MONGODB, { dbName: "murmur" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.log("Failed to connect to MongoDB. ", error.message)
  );

// Socket
let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  // Listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  /* Listen to users sending messages, 
  then push notifications/messages to recipients */
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => {
      return user.userId === message.recipientId;
    });
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnelineUsers", onlineUsers);
  });
});

server.listen(PORT, () => {
  console.log(`Application is running at https://murmur-chat.fly.dev:${PORT}`);
})
