import { Request, RequestHandler, Response } from "express";
import { User, UserBoard } from "../models";

/**
 * Add a user to a board
 */
export const addUserToBoard: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { boardId, username, role = "member" } = req.body; // role defaults to "member"

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already associated with the board
    const existingEntry = await UserBoard.findOne({
      where: { userId: user.id, boardId },
    });
    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "User is already part of this board" });
    }

    // Create a new UserBoard entry
    await UserBoard.create({ userId: user.id, boardId, role });

    res.status(201).json({ message: "User added to board successfully" });
  } catch (error) {
    console.error("Error adding user to board:", error);
    res.status(500).json({ message: "Server error" });
  }
};
