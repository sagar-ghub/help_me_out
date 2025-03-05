// components/SocketProvider.tsx
"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Connect to your Socket.io server (adjust the URL accordingly)
    if(!session)
    return
    const socketIo = io(process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000",{
      auth: { token: session?.user.token }, // Send token for authentication
      transports: ["websocket"], // Ensure WebSocket is used
    });

    setSocket(socketIo);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
