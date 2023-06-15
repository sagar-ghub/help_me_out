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
  /* options */
});

app.set("socketio", io);

app.get("/", async (req, res) => {
  let socket = req.app.get("socketio");

  socket.emit("message", "hello");
  res.send("Hello Wosrld!");
});

// io.on("connection", (socket) => {
//   // ...
//   console.log("A user connected");

//   socket.on("message", (msg) => {
//     console.log(msg);
//     io.emit("message", "asdasdasdas");
//   });

//   //Whenever someone disconnects this piece of code executed
//   socket.on("disconnect", function () {
//     console.log("A user disconnected");
//   });
// });
io.on("connect", (socket) => {
  console.log("user connected");

  socket.emit("message", "CHeck your notification");

  socket.on("valor", ({ id, name }, callback) => {
    console.log("data::", id, name);

    socket.emit(
      "receiveGreet",
      { data: "This message from server" },
      (error) => {
        console.log("error::", error);
      }
    );
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
