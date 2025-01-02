"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToBoard = void 0;
const models_1 = require("../models");
/**
 * Add a user to a board
 */
const addUserToBoard = async (req, res) => {
    try {
        const { boardId, username, role = "member" } = req.body; // role defaults to "member"
        const user = await models_1.User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the user is already associated with the board
        const existingEntry = await models_1.UserBoard.findOne({
            where: { userId: user.id, boardId },
        });
        if (existingEntry) {
            return res
                .status(400)
                .json({ message: "User is already part of this board" });
        }
        // Create a new UserBoard entry
        await models_1.UserBoard.create({ userId: user.id, boardId, role });
        res.status(201).json({ message: "User added to board successfully" });
    }
    catch (error) {
        console.error("Error adding user to board:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addUserToBoard = addUserToBoard;
