const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    status: { type: String, default: "open" },
    radius: { type: Number },
    acceptedBy: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: Date.now },
  },
  { collection: "tasks", timestamps: true }
);

TaskSchema.index({ location: "2dsphere" });
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
