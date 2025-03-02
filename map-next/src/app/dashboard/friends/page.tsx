"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { apiRequest } from "@/app/lib/api";
import NotificationListener from "@/app/components/NotificationListener";

// Define a simple user type
interface User {
  _id:string;
  id: string;
  name: string;
  email: string;
  status: "Online" | "Offline";
}

export default function FriendsPage() {
  // Dummy data for demonstration purposes
  const [friendRequests, setFriendRequests] = useState<User[]>([
    // { _id:"",id: "4", name: "David", email: "david@example.com", status: "Online" },
    // { _id:"",id: "5", name: "Eve", email: "eve@example.com", status: "Offline" },
  ]);

  const [friends, setFriends] = useState<User[]>([
    // { _id:"",id: "1", name: "Alice", email: "alice@example.com", status: "Online" },
    // { _id:"",id: "2", name: "Bob", email: "bob@example.com", status: "Offline" },
    // { _id:"",id: "3", name: "Charlie", email: "charlie@example.com", status: "Online" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Simulated function to respond to a friend request
  const respondToFriendRequest = async (userId: string, accept: boolean) => {
    // console.log(`Friend request for user ${userId} accepted: ${accept}`);
    // Remove the request from pending list
    // setFriendRequests((prev) => prev.filter((user) => user.id !== userId));
    const response:any = await apiRequest("/respondRequest","POST",{requesterId:userId,accept} );
    if(response.status=="ok"){
      fetchFriendList();
    }
      // const acceptedUser = friendRequests.find((user) => user.id === userId);
      // if (acceptedUser) {
      //   setFriends((prev) => [...prev, acceptedUser]);
      // }
    
  };

  const handleSearch = async () => {
    // Replace this with an API call in production.
    // For now, we'll filter the existing friends list as a demo.
    const results = friends.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const sendFriendRequest = async (user: User) => {
    // console.log("Sending friend request to", user);
    // In a real app, you'd call your API here.
    // For demo purposes, add the user to the pending requests list:
    const response:any = await apiRequest("/friendRequest","POST",{targetUserId:user._id} );
    if(response.status=="ok"){
      // fetchFriendList();
    }
    setFriendRequests((prev) => [...prev, user]);
  };
  useEffect(()=>{
    fetchFriendList()
    fetchSuggestions()
  },[])
  const fetchFriendList=async()=>{
    const data:any=await apiRequest("/friendList");
    setFriends(data.friends);
    setFriendRequests(data.requests)

  }
  const fetchSuggestions=async()=>{
  
    const data:any=await apiRequest("/suggestions");
    setSearchResults(data.suggestions);

  }

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            My Friends
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage friend requests and connect with people.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Search for Friends
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-between hover:shadow-lg transition"
                  >
                    <span className="text-gray-800 dark:text-gray-100">
                      {user.name}
                    </span>
                    <button
                      onClick={() => sendFriendRequest(user)}
                      className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Send Request
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery ? "No results found." : "Start typing to search..."}
              </p>
            )}
          </div>
        </div>

        {/* Two-column layout for Pending Requests and Friend List */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Pending Friend Requests */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Pending Friend Requests
            </h2>
            <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              {friendRequests.length > 0 ? (
                <ul className="space-y-3">
                  {friendRequests.map((user) => (
                    <li
                      key={user.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-md flex items-center justify-between bg-white dark:bg-gray-800 hover:shadow-md transition"
                    >
                      <span className="text-gray-800 dark:text-gray-100">
                        {user.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToFriendRequest(user._id, true)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToFriendRequest(user._id, false)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  No pending friend requests.
                </p>
              )}
            </div>
          </div>

          {/* Current Friends List */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Your Friends
            </h2>
            <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              {friends.length > 0 ? (
                <ul className="space-y-4">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-md shadow flex items-center hover:scale-105 transform transition"
                    >
                      <img
                        src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${friend._id}`}
                        alt={`${friend.name} Avatar`}
                        className="w-12 h-12 rounded-full mr-4 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {friend.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {friend.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  You have no friends yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
