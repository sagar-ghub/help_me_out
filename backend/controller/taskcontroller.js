const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const router = express.Router();

let task = {};

task.addTask = (req, res) => {
  const { title, description, location } = req.body;
  const task = new Task({
    user: req.user.id,
    title,
    description,
    location,
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
