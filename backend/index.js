const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const port = process.env.PORT || 5000;
const cors = require("cors");

const taskController = require("./controller/taskcontroller");
const { createServer } = require("http");
const { Server } = require("socket.io");
const routes = require("./routes");
const Chat = require("./models/Chat");
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

//MiddleWares
// app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_CRED}@cluster0.hh7px.mongodb.net/map-app?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database Connected");
  });

// app.post("/api/change-password", async (req, res) => {
//   const { token, newpassword: plainTextPassword } = req.body;

//   if (!plainTextPassword || typeof plainTextPassword !== "string") {
//     return res.json({ status: "error", error: "Invalid password" });
//   }

//   if (plainTextPassword.length < 5) {
//     return res.json({
//       status: "error",
//       error: "Password too small. Should be atleast 6 characters",
//     });
//   }

//   try {
//     const user = jwt.verify(token, JWT_SECRET);

//     const _id = user.id;

//     const password = await bcrypt.hash(plainTextPassword, 10);

//     await User.updateOne(
//       { _id },
//       {
//         $set: { password },
//       }
//     );
//     res.json({ status: "ok" });
//   } catch (error) {
//     console.log(error);
//     res.json({ status: "error", error: ";))" });
//   }
// });

// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username }).lean();

//   if (!user) {
//     return res.json({ status: "error", error: "Invalid username/password" });
//   }

//   if (await bcrypt.compare(password, user.password)) {
//     // the username, password combination is successful

//     const token = jwt.sign(
//       {
//         id: user._id,
//         username: user.username,
//       },
//       JWT_SECRET
//     );

//     return res.json({ status: "ok", data: token });
//   }

//   res.json({ status: "error", error: "Invalid username/password" });
// });

// app.post("/api/register", async (req, res) => {
//   const { username, email, password: plainTextPassword } = req.body;

//   if (!username || typeof username !== "string") {
//     return res.json({ status: "error", error: "Invalid username" });
//   }

//   if (!plainTextPassword || typeof plainTextPassword !== "string") {
//     return res.json({ status: "error", error: "Invalid password" });
//   }

//   if (plainTextPassword.length < 5) {
//     return res.json({
//       status: "error",
//       error: "Password too small. Should be atleast 6 characters",
//     });
//   }

//   const password = await bcrypt.hash(plainTextPassword, 10);

//   try {
//     const response = await User.create({
//       username,
//       email,
//       password,
//     });
//     console.log("User created successfully: ", response);
//   } catch (error) {
//     if (error.code === 11000) {
//       // duplicate key
//       return res.json({ status: "error", error: "Username already in use" });
//     }
//     throw error;
//   }

//   res.json({ status: "ok" });
// });

app.use("/api", routes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // allow requests from your Next.js app
    methods: ["GET", "POST"],
    credentials: true, // if you need to send cookies or authentication headers
  },
});

app.set("socketio", io);

app.get("/", async (req, res) => {
  let socket = req.app.get("socketio");

  socket.emit("message", "hello");
  res.send("Hello Wosrld!");
});
let activeUsers = new Map();

io.on("connection", (socket) => {
  // console.log(`🔵 New client connected: ${socket.id}`);
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("[Socket] No token provided. Disconnecting...");
    return socket.disconnect();
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID from the token

    // Join the user-specific room
    socket.join(userId);
    console.log(`🔵 [Socket] User ${userId} connected and joined room.`);

    // Store user in active connections map
    activeUsers.set(userId, socket.id);

    // Send welcome message
    socket.emit("welcome", { message: "Connected to notifications!" });

    // Notify others that user is online
    io.emit("userOnline", { userId });

    // Handle incoming messages
    // socket.on("sendMessage", ({ chatId, text }) => {
    //   console.log(
    //     `[Socket] Message received from ${userId}: ${text} and sent to ${chatId}`
    //   );

    //   io.to(chatId).emit("receiveMessage", { sender: userId, text });
    // });
    socket.on("sendMessage", async ({ chatId, sender, text }) => {
      console.log(`[Socket] Message received from ${sender}: ${text}`);

      const chat = await Chat.findById(chatId).populate("participants");
      if (!chat) {
        console.log("[Socket] Chat not found!");
        return;
      }

      const newMessage = {
        sender,
        text,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      // Send message to everyone EXCEPT sender
      chat.participants.forEach((user) => {
        if (user._id.toString() !== sender) {
          // ✅ Exclude sender
          console.log(`[Socket] Emitting message to: ${user._id.toString()}`);
          io.to(user._id.toString()).emit("receiveMessage", {
            chatId,
            message: newMessage,
          });
        }
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket] User ${userId} disconnected.`);
      activeUsers.delete(userId);
      io.emit("userOffline", { userId });
    });
  } catch (err) {
    console.error("[Socket] Invalid token:", err.message);
    socket.emit("authError", { message: "Invalid authentication" });
    socket.disconnect();
  }
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
