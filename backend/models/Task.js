const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: { type: String, default: "open" },
    // radius: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
    acceptedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    // time: { type: String },
  },
  { collection: "tasks" }
);

TaskSchema.index({ location: "2dsphere" });
const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
