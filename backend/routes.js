const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const taskController = require("./controller/taskcontroller");
const authController = require("./controller/authController");
const friendController = require("./controller/friendController");
const middleware = require("./middleware/auth-middleware");
const chatController = require("./controller/chatController");
router.post(
  "/tasks/accept",
  middleware.checkUserAuth,
  taskController.acceptTask
);
router.post("/addtask", middleware.checkUserAuth, taskController.addTask);
router.get("/tasks", middleware.checkUserAuth, taskController.getTasks);
router.post(
  "/gettasksbylocation",
  middleware.checkUserAuth,
  taskController.getTasksByLocation
);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/changePassword", authController.changePassword);
router.post(
  "/updateLocation",
  middleware.checkUserAuth,
  authController.updateLocation
);

router.get("/friendList", middleware.checkUserAuth, friendController.list);
router.get(
  "/users/search",
  middleware.checkUserAuth,
  friendController.searchUsers
);
router.get(
  "/suggestions",
  middleware.checkUserAuth,
  friendController.suggestions
);
router.post(
  "/friendRequest",
  middleware.checkUserAuth,
  friendController.requests
);
router.post(
  "/respondRequest",
  middleware.checkUserAuth,
  friendController.respond
);
router.post("/chat", middleware.checkUserAuth, chatController.getOrCreateChat);
router.post(
  "/chat/message",
  middleware.checkUserAuth,
  chatController.sendMessage
);
router.get(
  "/chat/:chatId/messages",
  middleware.checkUserAuth,
  chatController.getMessages
);
router.get("/chats", middleware.checkUserAuth, chatController.getUserChats);
router.put(
  "/chat/:chatId/read",
  middleware.checkUserAuth,
  chatController.markAsRead
);
router.post("/chat/start", middleware.checkUserAuth, chatController.startChat);

module.exports = router;
