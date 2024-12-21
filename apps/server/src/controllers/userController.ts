import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/User";
import { UserBoard } from "../models";

/**
 * Controller to search for users by a query (username or email).
 * @param req - Express request object containing the search query
 * @param res - Express response object to send the results
 */
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  const { searchQuery } = req.query;
  // If no search query is provided or it's not a string, return an error
  if (!searchQuery || typeof searchQuery !== "string") {
    res.status(400).json({ message: "Search query must be a string." });
    return;
  }

  try {
    // Search for users by matching the search query with username or email
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: `%${searchQuery}%`, // Case-insensitive search
            },
          },
          {
            email: {
              [Op.like]: `%${searchQuery}%`, // Case-insensitive search
            },
          },
        ],
      },
      attributes: ["id", "username", "email"], // Only return the id, username, and email
      include: [{
        model: UserBoard,
        attributes: ["userId", "boardId"]
      }]
    });

    // If no users are found, return an empty array
    // if (users.length === 0) {
    //   res.status(404).json({ message: "No users found." });
    //   return;
    // }

    // Send back the found users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
