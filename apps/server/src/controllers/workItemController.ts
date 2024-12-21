import { Request, RequestHandler, Response } from "express";
import { WorkItem } from "../models";

export const getWorkItems: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const workItems = await WorkItem.findAll({
      include: {
        model: WorkItem,
        where: { userId: userId },
      },
    });

    res.status(200).json({ workItems });
  } catch (error) {
    console.error("Error fetching workItems:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createWorkItem: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { boardId, userId, description, title, status, assignedTo } =
      req.body;

    // Validate the input
    if (!userId || !boardId) {
      return res
        .status(400)
        .json({ message: "userId and boardId are required" });
    }

    // Create the new board
    const workItem = await WorkItem.create({
      title,
      description: description || null,
      status: status || null,
      assignedTo: assignedTo || null,
      createdBy: userId,
      boardId, // Assuming `boardId` is a field on the WorkItem model
    });

    res
      .status(201)
      .json({ message: "Work item created successfully", workItem });
  } catch (error) {
    console.error("Error creating workItem:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateWorkItem: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { workItemId, description, title, status, assignedTo } = req.body;

    // Validate the input
    if (!workItemId) {
      return res
        .status(400)
        .json({ message: "workItem ID and boardId are required" });
    }

    // Create the new board
    const workItem = await WorkItem.update(
      {
        ...(description && { description }),
        ...(title && { title }),
        ...(status && { status }),
        ...(assignedTo && { assignedTo }),
      },
      {
        where: { id: workItemId },
      }
    );

    res
      .status(201)
      .json({ message: "Work item updated successfully", workItem });
  } catch (error) {
    console.error("Error updating workItem:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteWorkItem: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { workItemId } = req.body;

    // Validate the input
    if (!workItemId) {
      return res
        .status(400)
        .json({ message: "workItem ID and boardId are required" });
    }

    // Delete the work item from the database
    const deletedWorkItem = await WorkItem.destroy({
      where: { id: workItemId },
    });

    res
      .status(200)
      .json({ message: "Work item removed successfully", deletedWorkItem });
  } catch (error) {
    console.error("Error updating workItem:", error);
    res.status(500).json({ message: "Server error" });
  }
};
