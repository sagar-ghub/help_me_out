"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
// import { v4 as uuidv4 } from "uuid";
// import Image from "next/image";
import { useSession } from "next-auth/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { apiRequest } from "../lib/api";
import { useRouter } from "next/navigation";


interface Notification {
  taskId: string;
  message: string;
  title: string;
  description: string;
  friend: string;
  location: { lat: number; lng: number };
}

interface Chat {
  _id: string;
  participants: { _id: string; username: string }[];
  messages: Message[];
}
interface Message {
  sender: string;
  text: string;
  timestamp: string;
}
export default function NotificationListener() {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const router=useRouter()
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewTaskNotification = (data: any) => {
        console.log("📩 Received task notification:", data);

        
        setNotification({
          taskId:data.taskId,
          message: `Hey ${session?.user?.name || "User"}, ${data?.user || "Someone"} has a task near your location.`,
          title: data.title || "New Task",
          description: data.description || "A task is available nearby!",
          friend: data.userId || "Unknown",
          location: { 
            lat: data.location?.coordinates?.[1] || 20.5, // Ensure latitude is second
            lng: data.location?.coordinates?.[0] || 80.4  // Longitude is first
          },
        });
      };

    socket.on("newTaskNotification", handleNewTaskNotification);

    return () => {
      socket.off("newTaskNotification", handleNewTaskNotification);
    };
  }, [socket]);

  const handleAccept = async (taskId: string, creatorId: string) => {
    try {
      // API call to accept the task
      await apiRequest("/tasks/accept", "POST", { taskId });
  
      // Fetch existing chats
      const chatData = await apiRequest<{ chats: Chat[] }>("/chats", "GET");
      const existingChat = chatData.chats.find((chat) =>
        chat.participants.some((p) => p._id === creatorId)
      );
  
      if (existingChat) {
        // ✅ If chat exists, navigate to chat page
        router.push(`/dashboard/chat?chatId=${existingChat._id}`);
      } else {
        // ✅ If chat does not exist, create a new one
        const newChat = await apiRequest<{ chat: Chat }>("/chat/start", "POST", {
          userId: creatorId,
        });
        router.push(`/dashboard/chat?chatId=${newChat.chat._id}`);
      }
    } catch (error) {
      console.error("Error accepting task:", error);
    }
  };
  

  const handleReject = () => {
    setNotification(null);
  };

  return (
    <>
      {notification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96 transform transition-all scale-95 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
              {notification.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
              {notification.message}
            </p>

            {/* Dummy Map
            <div className="mt-4 flex justify-center">
              <Image
                src="/dummy-map.jpg" // Replace with an actual map API if needed
                alt="Task Location"
                width={300}
                height={200}
                className="rounded-lg shadow"
              />
            </div> */}
              <div className="mt-4 rounded-lg overflow-hidden shadow-md">
              <MapContainer
                center={[notification.location.lat, notification.location.lng]}
                zoom={13}
                style={{ height: "200px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[notification.location.lat, notification.location.lng]}>
                  <Popup>{notification.title}</Popup>
                </Marker>
              </MapContainer>
            </div>


            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 text-center">
              {notification.description}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
            <button
      onClick={() => handleAccept(notification.taskId, notification.friend)}
      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
    >
                ✅ Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition"
              >
                ❌ Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
