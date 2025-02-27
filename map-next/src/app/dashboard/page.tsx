"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
// let status=""
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col p-6">
        <div className="mb-8 flex items-center justify-center">
          <h2 className="text-2xl font-bold">My Dashboard</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-3">
            <li>
              <a
                href="/dashboard"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                  ></path>
                </svg>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard/map"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.894L9 1m0 19l6-3m-6 3v-6.5m6 6.5V11m0 0l5.447-2.724A2 2 0 0121 7.618V5.618a2 2 0 00-1.553-1.894L15 1"
                  ></path>
                </svg>
                <span>Map</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard/tasks"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard/chat"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.985 9.985 0 01-4-.8L3 20l1.8-4.2C3.668 14.062 3 13.082 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>Chat</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard/friends"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z"
                  ></path>
                </svg>
                <span>Friends</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-8">
          <a
            href="/api/auth/signout"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              ></path>
            </svg>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Welcome, 
            {/* {session?.user?.name} */}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This is your dashboard where you can manage tasks, view maps, chat with friends,
            and more.
          </p>
          {/* Sample Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow transform transition hover:scale-105">
              <h2 className="text-2xl font-bold mb-2">Upcoming Tasks</h2>
              <p className="text-lg">
                You have <span className="font-bold">3 tasks</span> due this week.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg shadow transform transition hover:scale-105">
              <h2 className="text-2xl font-bold mb-2">Recent Activity</h2>
              <p className="text-lg">
                <span className="font-bold">Alex</span> accepted your task request.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
