const mongoose = require("mongoose");

const TaxSchema = new mongoose.Schema(
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
    date: { type: Date },
    time: { type: String },
  },
  { collection: "tasks" }
);

const Task = mongoose.model("Task", TaxSchema);

module.exports = Task;
