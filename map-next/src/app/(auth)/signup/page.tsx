// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Post signup data to your API endpoint (ensure you have an endpoint to handle this)
    try {
      const response:any = await apiRequest("/register","POST",{username:formData.email,email:formData.email,password:formData.password,name:formData.name} );
      if (response.status === "ok") {
        // Optionally, redirect to login page or auto-login
        router.push("/login");
      } else {
        setError( "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Sign Up
        </h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
          >
            Sign Up
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            viewBox="0 0 48 48"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.26 0 6.24 1.12 8.53 2.93l6.38-6.38C34.03 3.72 29.33 1.5 24 1.5 14.53 1.5 6.41 6.59 2.41 14.09l7.31 5.68C11.95 14.66 17.17 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.13 24.33c0-1.65-.14-3.24-.4-4.75H24v9h12.45c-.54 2.89-2.19 5.34-4.66 7L40 40.94c3.33-3.08 5.22-7.61 5.22-16.61z"
            />
            <path
              fill="#FBBC05"
              d="M10.72 28.41a13.77 13.77 0 0 1 0-8.86L3.41 14.09a23.58 23.58 0 0 0 0 19.82l7.31-5.68z"
            />
            <path
              fill="#EA4335"
              d="M24 46.5c6.48 0 11.92-2.15 15.89-5.84l-7.68-6.4a15.19 15.19 0 0 0 0-8.13l7.68-6.4C35.92 20.35 30.48 18.2 24 18.2c-6.83 0-12.05 5.16-13.28 12.09l-7.31 5.68A23.58 23.58 0 0 0 24 46.5z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
