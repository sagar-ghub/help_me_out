"use client";

import DashboardLayout from "../components/DashboardLayout";
import dynamic from "next/dynamic";

// Import MapComponentWithTask dynamically to disable SSR
const MapComponentWithTask = dynamic(
  () => import("./MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-300">Loading map...</p>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Map
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Click on a location to add a task.
        </p>
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <MapComponentWithTask />
        </div>
      </div>
    </DashboardLayout>
  );
}
