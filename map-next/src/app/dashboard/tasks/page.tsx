"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          This is the Tasks page. Manage and track your tasks here.
        </p>
        <div className="mt-6">
          <ul className="space-y-4">
            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Task 1</h2>
              <p className="text-gray-600 dark:text-gray-300">Description of task 1.</p>
            </li>
            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Task 2</h2>
              <p className="text-gray-600 dark:text-gray-300">Description of task 2.</p>
            </li>
            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Task 3</h2>
              <p className="text-gray-600 dark:text-gray-300">Description of task 3.</p>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
