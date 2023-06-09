const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const taskController = require("./controller/taskcontroller");
const authController = require("./controller/authController");
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

module.exports = router;
