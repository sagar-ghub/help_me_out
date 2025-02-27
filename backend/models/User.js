const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    lastLocation: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        // required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { collection: "users", timestamps: true }
);

const model = mongoose.model("User", UserSchema);

module.exports = model;
