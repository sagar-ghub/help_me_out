const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    messages: [
      {
        sender: { type: mongoose.Types.ObjectId, ref: "User" },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Chat", ConversationSchema);
