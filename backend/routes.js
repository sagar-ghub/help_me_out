const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const taskController = require("./controller/taskcontroller");
const authController = require("./controller/authController");
const friendController = require("./controller/friendController");
const middleware = require("./middleware/auth-middleware");
router.post("/addtask", middleware.checkUserAuth, taskController.addTask);
router.get("/gettasks", middleware.checkUserAuth, taskController.getTasks);
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

module.exports = router;
