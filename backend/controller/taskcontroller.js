const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const router = express.Router();

let task = {};

task.addTask = (req, res) => {
  const { title, description, location, radius } = req.body;
  const task = new Task({
    user: req.user.id,
    title,
    description,

    radius,
  });
  task.location = {
    type: "Point",
    coordinates: [parseFloat(location[0]), parseFloat(location[1])],
  };
  task
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ status: 201, message: "Task Added", task: result });
      setImmediate(() => {
        sendNotifications(result, req);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
async function sendNotifications(task, req) {
  try {
    // Get the Socket.io instance from the Express app
    const io = req.app.get("socketio");

    // Find users near the task's location within the given radius (in meters)
    const usersToNotify = await User.find({
      lastLocation: {
        $near: {
          $geometry: task.location,
          $maxDistance: task.radius,
        },
      },
    });

    // Notify each user; for this example, assume each user has joined a room with their user ID
    usersToNotify.forEach((user) => {
      io.to(user._id.toString()).emit("newTaskNotification", {
        taskId: task._id,
        title: task.title,
        description: task.description,
        location: task.location,
        radius: task.radius,
      });
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

task.getTasks = (req, res) => {
  Task.find()
    .then((result) => {
      res.status(200).json({ tasks: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
task.getTasksByLocation = (req, res) => {
  const lat = parseFloat(req.body[0]);
  const lng = parseFloat(req.body[1]);
  Task.find({
    location: {
      $near: {
        $maxDistance: 50000,
        $geometry: {
          type: "Point",
          coordinates: [lat, lng],
        },
      },
    },
    // status: "open",
  })
    .then((result) => {
      res.status(200).json({ tasks: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
// router.get("/addtask", (req, res) => {
//   const { user, title, description, location } = req.body;

//   const task = new Task({
//     user,
//     title,
//     description,
//     location,
//   });

//   task
//     .save()
//     .then((result) => {
//       res.status(201).json({ message: "Task Added" });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// });

module.exports = task;
