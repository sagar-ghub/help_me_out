// components/NotificationListener.tsx
"use client";
import { useEffect } from "react";
import { useSocket } from "./SocketProvider";

export default function NotificationListener() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewTaskNotification = (data: any) => {
      console.log("Received task notification:", data);
      // TODO: Display a notification (toast, modal, etc.) here
    };

    socket.on("newTaskNotification", handleNewTaskNotification);

    return () => {
      socket.off("newTaskNotification", handleNewTaskNotification);
    };
  }, [socket]);

  return null;
}
