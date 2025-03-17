const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [MessageSchema],
    lastMessage: { type: MessageSchema }, // Stores the latest message for quick access
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
