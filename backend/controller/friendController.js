// routes/friends.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth-middleware");

let friend = {};

// POST /api/friends/request
// Send a friend request from the authenticated user to targetUserId.
friend.requests = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const requesterId = req.user.id;

    if (!targetUserId) {
      return res
        .status(400)
        .json({ status: "error", error: "targetUserId is required" });
    }

    if (targetUserId === requesterId) {
      return res.status(400).json({
        status: "error",
        error: "Cannot send friend request to yourself",
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ status: "error", error: "Target user not found" });
    }

    // Check if they are already friends
    if (targetUser.friends && targetUser.friends.includes(requesterId)) {
      return res
        .status(400)
        .json({ status: "error", error: "You are already friends" });
    }

    // Check if request already exists
    if (
      targetUser.friendRequests &&
      targetUser.friendRequests.includes(requesterId)
    ) {
      return res
        .status(400)
        .json({ status: "error", error: "Friend request already sent" });
    }

    // Add the requester's id to the target user's friendRequests array
    targetUser.friendRequests = targetUser.friendRequests || [];
    targetUser.friendRequests.push(requesterId);
    await targetUser.save();

    return res
      .status(200)
      .json({ status: "ok", message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

// POST /api/friends/requests/respond
// Respond to a friend request. Request body should include:
// { requesterId: String, accept: Boolean }
// Here, the authenticated user is the one who received the friend request.
friend.respond = async (req, res) => {
  try {
    const { requesterId, accept } = req.body;
    const currentUserId = req.user.id;

    if (!requesterId || typeof accept !== "boolean") {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid request data" });
    }

    // Find the current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    // Check if the friend request exists
    if (
      !currentUser.friendRequests ||
      !currentUser.friendRequests.includes(requesterId)
    ) {
      return res
        .status(400)
        .json({ status: "error", error: "No friend request from this user" });
    }

    // Remove the friend request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    if (accept) {
      // Add requesterId to current user's friends list if not already present
      currentUser.friends = currentUser.friends || [];
      if (!currentUser.friends.includes(requesterId)) {
        currentUser.friends.push(requesterId);
      }
      // Also add current user to requester's friends list
      const requester = await User.findById(requesterId);
      if (requester) {
        requester.friends = requester.friends || [];
        if (!requester.friends.includes(currentUserId)) {
          requester.friends.push(currentUserId);
        }
        await requester.save();
      }
    } else {
      currentUser.friendRequests.pull(requesterId);
    }

    await currentUser.save();
    return res
      .status(200)
      .json({ status: "ok", message: "Friend request processed" });
  } catch (error) {
    console.error("Error processing friend request:", error);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

// GET /api/friends
// Return the list of friends for the authenticated user.
friend.list = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId).populate(
      "friends friendRequests",
      "username email lastLocation name"
    );
    if (!currentUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    return res.status(200).json({
      status: "ok",
      friends: currentUser.friends,
      requests: currentUser.friendRequests,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};
friend.suggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // Fetch the current user with friends and friendRequests fields
    const currentUser = await User.findById(currentUserId).lean();
    if (!currentUser) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    // Build an array of IDs to exclude (self, already friends, pending requests)
    const excludeIds = [
      currentUser._id,
      ...(currentUser.friends || []),
      ...(currentUser.friendRequests || []),
    ];

    // Start with a basic query to exclude those users
    let query = User.find({
      _id: { $nin: excludeIds },
    }).limit(10);

    // Optionally, if the user has a location, sort by proximity
    // if (
    //   currentUser.lastLocation &&
    //   currentUser.lastLocation.coordinates &&
    //   currentUser.lastLocation.coordinates.length === 2
    // ) {
    //   query = query.where("lastLocation").near({
    //     center: {
    //       type: "Point",
    //       coordinates: currentUser.lastLocation.coordinates,
    //     },
    //     maxDistance: 50000, // e.g., 50 km in meters
    //   });
    // }

    const suggestions = await query.exec();
    res.status(200).json({ status: "ok", suggestions });
  } catch (error) {
    console.error("Error fetching friend suggestions:", error);
    res.status(500).json({ status: "error", error: "Server error" });
  }
};
module.exports = friend;
