"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { apiRequest } from "@/app/lib/api";
import { useSocket } from "@/app/components/SocketProvider";
import { useSession } from "next-auth/react";
import {  useSearchParams } from "next/navigation";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  participants: { _id: string; username: string }[];
  messages: Message[];
}

interface User {
  _id: string;
  username: string;
}

export default function ChatPage() {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const userId = session?.user?.id;
  // const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the last message when chat updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);
  
  useEffect(() => {
    const chatId = searchParams.get("chatId");
  
    if (chatId) {
      // Wait until chats are loaded before setting the chat
      if (chats.length > 0) {
        console.log(chats,chatId)
        const chatToOpen = chats.find((chat) => (chat.participants[0]._id === chatId || chat.participants[1]._id === chatId));
        if (chatToOpen) {
          setCurrentChat(chatToOpen);
        }
      }
    }
  }, [chats, searchParams]);

  // Fetch existing chats
  useEffect(() => {
    async function fetchChats() {
      try {
        const data = await apiRequest<{ chats: Chat[] }>("/chats", "GET");
        setChats(data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    if (userId) fetchChats();
  }, [userId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: { chatId: string; message: Message }) => {
      console.log(`📩 New message received:`, data);

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === data.chatId
            ? { ...chat, messages: [...chat.messages, data.message] }
            : chat
        )
      );

      // If the current chat is open, update its messages
      if (currentChat?._id === data.chatId) {
        setCurrentChat((prev) =>
          prev ? { ...prev, messages: [...prev.messages, data.message] } : prev
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, currentChat]);

  // Send a message
  const sendMessage = async () => {
    if (!currentChat || !message) return;
  
    const newMessage = {
      sender: userId || "",
      text: message,
      timestamp: new Date().toISOString(),
    };
  
    // ✅ Immediately update UI for sender
    setCurrentChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
    );
  
    // ✅ Emit message via socket to inform receiver
    socket?.emit("sendMessage", { chatId: currentChat._id, ...newMessage });
  
    setMessage(""); // Clear input field
  };
  

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const data = await apiRequest<{ users: User[] }>(`/users/search?query=${searchQuery}`, "GET");
      setSearchResults(data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Start a new chat with a selected user
  const startChat = async (user: User) => {
    try {
      const data = await apiRequest<{ chat: Chat }>("/chat/start", "POST", {
        userId: user._id,
      });
      setChats((prev) => [data.chat, ...prev]);
      setCurrentChat(data.chat);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        {/* Left Sidebar (Chat List & Search) */}
        <div className="w-1/3 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chats</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md">
              Search
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Start a chat with:</h3>
              <ul>
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    className="p-2 bg-white dark:bg-gray-700 rounded-md mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => startChat(user)}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Chat List */}
          <ul>
            {chats.map((chat) => {
              const friend = chat.participants.find((p) => p._id !== userId);
              return (
                <li
                  key={chat._id}
                  className={`p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    currentChat?._id === chat._id ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700"
                  }`}
                  onClick={() => setCurrentChat(chat)}
                >
                  {friend?.username || "Unknown User"}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col p-4 bg-white dark:bg-gray-900">
          {currentChat ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {currentChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 my-1 rounded-xl shadow-md transition-all duration-300 ${
                      msg.sender === userId
                        ? "ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                        : "mr-auto bg-gray-200 text-black"
                    }`}
                    style={{
                      // display: "inline-block",  // Allows auto width
                      maxWidth: "70%", // Prevents full width stretching
                      minWidth: "50px",
                      padding: "8px 12px",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                 {/* Empty div for auto-scroll */}
              <div ref={messagesEndRef}></div>
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a chat or search for users to start a conversation.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
