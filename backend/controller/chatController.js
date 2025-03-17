const Chat = require("../models/Chat");
const User = require("../models/User");

const chatController = {};

// ✅ **1. Create or Fetch a Chat Between Users**
chatController.getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recipientId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    }).populate("participants", "username");

    if (!chat) {
      chat = await Chat.create({ participants: [userId, recipientId] });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ✅ **2. Send a Message**
chatController.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const message = {
      sender: senderId,
      text,
      timestamp: new Date(),
      status: "sent",
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: "Could not send message" });
  }
};

// ✅ **3. Get Messages for a Chat**
chatController.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "username"
    );

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
};

// ✅ **4. Get All Chats for a User**
chatController.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username")
      .populate("lastMessage.sender", "username")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch chats" });
  }
};

// ✅ **5. Mark Messages as Read**
chatController.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== userId) msg.status = "read";
    });

    await chat.save();
    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Could not update message status" });
  }
};

chatController.startChat = async (req, res) => {
  try {
    const { userId: recipientId } = req.body; // Get the recipient's user ID from request body
    const senderId = req.user.id; // Get sender's user ID from authentication middleware

    if (!recipientId) {
      return res.status(400).json({ error: "Recipient ID is required." });
    }

    if (recipientId === senderId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot start a chat with yourself." });
    }

    // Check if a chat already exists between these users
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!chat) {
      // If no chat exists, create a new chat
      chat = new Chat({
        participants: [senderId, recipientId],
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json({ message: "Chat started successfully.", chat });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = chatController;
