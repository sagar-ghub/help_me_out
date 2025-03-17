// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Attempt to sign in with credentials (make sure to configure your credentials provider)
    const res = await signIn("credentials", {
      redirect: false,
      username:email,
      password,
    });
    if (res?.error) {
      setError("Invalid email or password.");
    } else if (res?.ok) {
      // If successful, redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Sign In
        </h2>
        {error && (
          <p className="mb-4 text-red-500 text-center">{error}</p>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="w-full border-gray-300 dark:border-gray-700" />
          <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
          <hr className="w-full border-gray-300 dark:border-gray-700" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-200"
        >
          {/* <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C34.807 33.231 30.642 37 24 37c-7.732 0-14-6.268-14-14s6.268-14 14-14c3.657 0 7.019 1.371 9.591 3.611l6.343-6.343C34.124 5.847 29.382 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.337-.135-2.637-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.577 4.816C14.06 16.576 18.75 14 24 14c3.657 0 7.019 1.371 9.591 3.611l6.343-6.343C34.124 5.847 29.382 4 24 4 16.162 4 9.312 8.211 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.982 0 11.018-2.215 14.75-5.731l-6.953-5.681C30.617 34.782 27.4 36 24 36c-6.273 0-11.584-4.13-13.464-9.687l-7.09 5.47C8.995 38.476 15.934 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.102 3.21-3.856 5.687-7.303 5.687-4.134 0-7.5-3.366-7.5-7.5s3.366-7.5 7.5-7.5c2.04 0 3.877.86 5.192 2.226l5.681-5.681C34.556 12.75 29.823 11 24 11 14.611 11 7 18.611 7 28s7.611 17 17 17 17-7.611 17-17c0-1.137-.113-2.242-.389-3.917z"
            />
          </svg> */}
          Sign in with Google
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
