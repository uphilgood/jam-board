import { Request, Response } from "express";
import { UserBoard } from "../models";

/**
 * Add a user to a board
 */
export const addUserToBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, userId, role = "member" } = req.body; // role defaults to "member"

    // Check if the user is already associated with the board
    const existingEntry = await UserBoard.findOne({
      where: { userId, boardId },
    });
    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "User is already part of this board" });
    }

    // Create a new UserBoard entry
    await UserBoard.create({ userId, boardId, role });

    res.status(201).json({ message: "User added to board successfully" });
  } catch (error) {
    console.error("Error adding user to board:", error);
    res.status(500).json({ message: "Server error" });
  }
};
