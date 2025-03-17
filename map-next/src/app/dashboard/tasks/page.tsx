"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { apiRequest } from "@/app/lib/api";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  user:string
}

export default function TasksPage() {
  const [acceptedTasks, setAcceptedTasks] = useState<Task[]>([]);
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router=useRouter()

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data: any = await apiRequest<{ tasks: Task[] }>("/tasks", "GET");
        console.log(data);
        setAcceptedTasks(data.acceptedTasks || []);
        setCreatedTasks(data.createdTasks || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };
  const handleChatNow=(user:string)=>{
    router.push(`/dashboard/chat?chatId=${user}`);
  }

  const renderTaskList = (tasks: Task[], title: string) => (
    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {task.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          </li>
        ))}
        {tasks.length==0 &&  <p className="text-gray-600 dark:text-gray-300">
            No tasks
            </p>}
      </ul>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and track your tasks here.
        </p>
        {loading && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading tasks...
          </p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-6 flex space-x-4">
          {renderTaskList(acceptedTasks, "Accepted Tasks")}
          {renderTaskList(createdTasks, "Created Tasks")}
        </div>

        {/* Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all scale-95 animate-fade-in w-96 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-lg"
                onClick={closeModal}
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {selectedTask.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedTask.description}
              </p>
              <button
                onClick={()=>handleChatNow(selectedTask.user)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Chat Now!
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
