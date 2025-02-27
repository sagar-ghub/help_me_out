// app/page.tsx
import React from "react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to My Innovative App
            </h1>
            <p className="text-xl mb-8">
              Connect with your friends, share tasks, and get help when you need it.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/login"
                className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </a>
              <a
                href="/signup"
                className="border border-white py-3 px-6 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Location Based Tasks
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get notified when friends need help in your vicinity.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Real-Time Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect instantly with your friends to coordinate and share tasks.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Easy Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in with Google or via email/password effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-around items-center gap-8">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Post a Task</h3>
              <p className="text-lg">
                Simply post your task and wait for your friends to respond.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Accept the Request</h3>
              <p className="text-lg">
                Friends near the location will get notified to help you out.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Chat and Coordinate</h3>
              <p className="text-lg">
                Once connected, you can chat and coordinate seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} My Innovative App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
