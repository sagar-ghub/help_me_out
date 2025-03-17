// app/dashboard/map/TaskMarker.tsx
"use client";

import { useState } from "react";
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import { apiRequest } from "@/app/lib/api";
import dynamic from "next/dynamic";

// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Popup = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Popup),
//   { ssr: false }
// );

export default function TaskMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Listen for map click events
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setSubmitted(false);
      setTaskTitle("");
      setTaskDescription("");
      setError("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (!taskTitle.trim() || !taskDescription.trim()) {
      setError("Both title and description are required.");
      return;
    }

    console.log("Task added at", position, "with description:", taskDescription);

    const res: any = await apiRequest("/addtask", "POST", {
      title: taskTitle,
      description: taskDescription,
      location: [position?.lat, position?.lng],
      radius: 50,
    });

    if (res.status === 201) setSubmitted(true);
  };

  if (!position) return null;
  
  return (
    <Marker position={position} key={`map-1`}>
      <Popup className="dark:bg-gray-900">
        {!submitted ? (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              Add New Task
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task details..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-20"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!taskTitle.trim() || !taskDescription.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl text-center w-80">
            <h3 className="text-lg font-bold text-green-600">🎉 Task Added!</h3>
            <p className="text-gray-600 dark:text-gray-300">Your task has been added successfully.</p>
            <button
              onClick={() => setPosition(null)}
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        )}
      </Popup>
    </Marker>
  );
}
