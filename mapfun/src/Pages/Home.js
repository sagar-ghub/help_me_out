import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";

export default function Home() {
  const token = localStorage.getItem("token");
  let user = token.split(".")[1];
  user = JSON.parse(atob(user));
  console.log(user);
  let socket;
  const serverUrl = "http://localhost:5000";
  useEffect(() => {
    socket = io(serverUrl);
    socket.on("message", (data) => {
      console.log("data::", data);
    });
    socket.emit("valor", { id: 1, name: "asdasd" }, (error) => {
      console.log("error::", error);
    });

    socket.on("receiveGreet", (data) => {
      console.log("data::", data);
    });
  }, []);

  return (
    <div>
      <Sidebar user={user?.username} />

      <Map user={user?.username} />
    </div>
  );
}
