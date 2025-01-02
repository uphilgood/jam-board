"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.getBoards = void 0;
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
        // join UserBoard to get all boards that the user has access to and return board info
        // and the role of the user in the board
        const boards = await models_1.Board.findAll({
            include: {
                model: models_1.UserBoard,
                where: { userId: userId },
            },
        });
        console.log("boards: ", boards);
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
const updateBoard = async (req, res) => {
    const { boardId, name, description } = req.body;
    try {
        const board = await models_1.Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        // Update the board
        board.name = name || board.name;
        board.description = description || board.description;
        await board.save();
        res.status(200).json({ message: "Board updated successfully", board });
    }
    catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateBoard = updateBoard;
const deleteBoard = async (req, res) => {
    const { userId, boardId } = req.body;
    // Validate the input
    if (!userId || !boardId) {
        return res.status(400).json({ message: "userId and boardId are required" });
    }
    try {
        // Find the board to delete
        const board = await models_1.Board.findOne({
            where: { id: boardId },
        });
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        // Check if the user is the owner of the board
        const userBoard = await models_1.UserBoard.findOne({
            where: { userId, boardId },
        });
        if (!userBoard || userBoard.role !== "owner") {
            return res.status(403).json({
                message: "You do not have permission to delete this board",
            });
        }
        // Delete related entries in UserBoard table
        await models_1.UserBoard.destroy({
            where: { boardId },
        });
        // Delete the board
        await board.destroy();
        res.status(200).json({ message: "Board deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteBoard = deleteBoard;
