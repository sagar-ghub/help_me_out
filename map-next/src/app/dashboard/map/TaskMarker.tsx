// app/dashboard/map/TaskMarker.tsx
"use client";

import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { apiRequest } from "@/app/lib/api";
import { title } from "process";

export default function TaskMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Listen for map click events
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setSubmitted(false);
      setTaskDescription("");
    },
  });

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the data. Later, call your API endpoint.
    console.log("Task added at", position, "with description:", taskDescription);
    let res:any=await apiRequest("/addtask","POST",{
      title:taskTitle, description:taskDescription, location:[position?.lat,position?.lng], radius:50
    })
    if(res.status==201)
    setSubmitted(true);
  };
  
  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="mt-1 block w-full border border-gray-300 rounded-md p-1"
              />
              <label className="block text-sm font-medium text-gray-700">
                Task Description
              </label>
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task details..."
                className="mt-1 block w-full border border-gray-300 rounded-md p-1"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              Add Task
            </button>
          </form>
        ) : (
          <div>
            <p>Task added!</p>
            <button
              onClick={() => setPosition(null)}
              className="text-blue-500 underline"
            >
              Close
            </button>
          </div>
        )}
      </Popup>
    </Marker>
  );
}
