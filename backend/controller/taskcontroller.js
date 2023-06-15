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
    location,
    radius,
  });

  task
    .save()
    .then((result) => {
      res.status(201).json({ message: "Task Added" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

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
  Task.find({
    location: {
      $near: {
        $maxDistance: 50000,
        $geometry: {
          type: "Point",
          coordinates: [req.body.lng, req.body.lat],
        },
      },
    },
  })
    .then((result) => {
      res.status(200).json({ tasks: result });
    })
    .catch((err) => {
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
