"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoard = exports.getBoards = void 0;
const models_1 = require("../models");
/**
 * Get all boards that a user has access to
 * @route GET /boards?userId=1
 */
const getBoards = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const boards = await models_1.Board.findAll({
            include: {
                model: models_1.UserBoard,
                where: { userId: userId },
            },
        });
        res.status(200).json({ boards });
    }
    catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getBoards = getBoards;
/**
 * Create a new board and associate it with the creator in the UserBoard table
 * @route POST /boards
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
const createBoard = async (req, res) => {
    try {
        const { userId, name, description } = req.body;
        // Validate the input
        if (!userId || !name) {
            return res.status(400).json({ message: "userId and name are required" });
        }
        // Create the new board
        const board = await models_1.Board.create({
            name,
            description: description || null,
            ownerId: userId, // Assuming `ownerId` is a field on the Board model
        });
        // Add an entry to UserBoard to give the creator access to the board as the owner
        await models_1.UserBoard.create({
            userId,
            boardId: board.id,
            role: "owner",
        });
        res.status(201).json({ message: "Board created successfully", board });
    }
    catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createBoard = createBoard;
