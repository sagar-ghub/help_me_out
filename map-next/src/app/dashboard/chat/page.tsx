"use client";

import DashboardLayout from "../components/DashboardLayout";
import { useState } from "react";

export default function ChatPage() {
  // Sample data for recent chats
  const chats = [
    { id: "1", name: "Alice", lastMessage: "Hey, how are you?" },
    { id: "2", name: "Bob", lastMessage: "Let's catch up tomorrow." },
    { id: "3", name: "Charlie", lastMessage: "Sent a file." },
  ];

  // Sample conversation messages for the selected chat
  const sampleMessages = [
    { id: "1", sender: "Alice", text: "Hello, how's it going?" },
    { id: "2", sender: "You", text: "I'm good, thanks! How about you?" },
    { id: "3", sender: "Alice", text: "I'm great. Looking forward to our meeting." },
  ];

  const [selectedChat, setSelectedChat] = useState<typeof chats[0] | null>(null);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now().toString(),
      sender: "You",
      text: newMessage.trim(),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg h-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Chat
        </h1>
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Recent Chats Sidebar */}
          <div className="md:w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Recent Chats
            </h2>
            <ul className="space-y-3">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedChat && selectedChat.id === chat.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  <img
                    src={`/avatar${chat.id}.png`}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {chat.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {chat.lastMessage}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="md:w-2/3 flex flex-col justify-between pl-4">
            <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
              {selectedChat ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                        message.sender === "You"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a chat to start messaging
                  </p>
                </div>
              )}
            </div>
            {selectedChat && (
              <form onSubmit={handleSendMessage} className="mt-4 flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
