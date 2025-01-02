"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.searchUsers = void 0;
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User"));
const models_1 = require("../models");
/**
 * Controller to search for users by a query (username or email).
 * @param req - Express request object containing the search query
 * @param res - Express response object to send the results
 */
const searchUsers = async (req, res) => {
    const { searchQuery } = req.query;
    // If no search query is provided or it's not a string, return an error
    if (!searchQuery || typeof searchQuery !== "string") {
        res.status(400).json({ message: "Search query must be a string." });
        return;
    }
    try {
        // Search for users by matching the search query with username or email
        const users = await User_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        username: {
                            [sequelize_1.Op.like]: `%${searchQuery}%`, // Case-insensitive search
                        },
                    },
                    {
                        email: {
                            [sequelize_1.Op.like]: `%${searchQuery}%`, // Case-insensitive search
                        },
                    },
                ],
            },
            attributes: ["id", "username", "email"], // Only return the id, username, and email
            include: [
                {
                    model: models_1.UserBoard,
                    attributes: ["userId", "boardId"],
                },
            ],
        });
        // If no users are found, return an empty array
        // if (users.length === 0) {
        //   res.status(404).json({ message: "No users found." });
        //   return;
        // }
        // Send back the found users
        res.status(200).json({ users });
    }
    catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.searchUsers = searchUsers;
const getUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }
    try {
        const user = await User_1.default.findByPk(userId, {
            attributes: ["id", "username", "email"],
        });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getUser = getUser;
