import { Request, RequestHandler, Response } from "express";
import { Board, UserBoard, WorkItem } from "../models";

/**
 * Get all boards that a user has access to
 * @route GET /boards?userId=1
 */
export const getBoards: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const boards = await Board.findAll({
      include: {
        model: UserBoard,
        where: { userId: userId },
      },
    });

    res.status(200).json({ boards });
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new board and associate it with the creator in the UserBoard table
 * @route POST /boards
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const createBoard: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, name, description } = req.body;

    // Validate the input
    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name are required" });
    }

    // Create the new board
    const board = await Board.create({
      name,
      description: description || null,
      ownerId: userId, // Assuming `ownerId` is a field on the Board model
    });

    // Add an entry to UserBoard to give the creator access to the board as the owner
    await UserBoard.create({
      userId,
      boardId: board.id,
      role: "owner",
    });

    res.status(201).json({ message: "Board created successfully", board });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a board and remove all related entries in the UserBoard table
 * @route DELETE /boards
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const deleteBoard: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, boardId } = req.body;

  // Validate the input
  if (!userId || !boardId) {
    return res.status(400).json({ message: "userId and boardId are required" });
  }

  try {
    // Find the board to delete
    const board = await Board.findOne({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if the user is the owner of the board
    const userBoard = await UserBoard.findOne({
      where: { userId, boardId },
    });

    if (!userBoard || userBoard.role !== "owner") {
      return res.status(403).json({
        message: "You do not have permission to delete this board",
      });
    }

    // Delete related entries in UserBoard table
    await UserBoard.destroy({
      where: { boardId },
    });

    // Delete the board
    await board.destroy();

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Server error" });
  }
};
