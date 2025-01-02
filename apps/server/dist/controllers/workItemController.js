"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkItem = exports.updateWorkItem = exports.createWorkItem = exports.getWorkItemsByBoardId = exports.getWorkItems = void 0;
const models_1 = require("../models");
const getWorkItems = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const workItems = await models_1.WorkItem.findAll({
            include: {
                model: models_1.WorkItem,
                where: { userId: userId },
            },
        });
        res.status(200).json({ workItems });
    }
    catch (error) {
        console.error("Error fetching workItems:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getWorkItems = getWorkItems;
const getWorkItemsByBoardId = async (req, res) => {
    const { userId, boardId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    if (!boardId) {
        return res.status(400).json({ message: "Board ID is required" });
    }
    try {
        const workItems = await models_1.WorkItem.findAll({ where: { boardId: boardId } });
        res.status(200).json({ workItems });
    }
    catch (error) {
        console.error("Error fetching workItems:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getWorkItemsByBoardId = getWorkItemsByBoardId;
const createWorkItem = async (req, res) => {
    try {
        const { boardId, userId, description, title, status, assignedTo } = req.body;
        // Validate the input
        if (!userId || !boardId) {
            return res
                .status(400)
                .json({ message: "userId and boardId are required" });
        }
        // Create the new board
        const workItem = await models_1.WorkItem.create({
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
    }
    catch (error) {
        console.error("Error creating workItem:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createWorkItem = createWorkItem;
const updateWorkItem = async (req, res) => {
    try {
        const { workItemId, description, title, status, assignedTo } = req.body;
        // Validate the input
        if (!workItemId) {
            return res
                .status(400)
                .json({ message: "workItem ID and boardId are required" });
        }
        const workItem = await models_1.WorkItem.findByPk(workItemId);
        if (!workItem) {
            return res.status(404).json({ message: "Work item not found" });
        }
        workItem.update(Object.assign(Object.assign(Object.assign(Object.assign({}, (description && { description })), (title && { title })), (status && { status })), (assignedTo && { assignedTo })));
        res
            .status(201)
            .json({ message: "Work item updated successfully", workItem });
    }
    catch (error) {
        console.error("Error updating workItem:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateWorkItem = updateWorkItem;
const deleteWorkItem = async (req, res) => {
    try {
        const { workItemId, userId } = req.body;
        // Validate the input
        if (!workItemId || !userId) {
            return res
                .status(400)
                .json({ message: "workItem ID  and User ID is required" });
        }
        // check to see if user is authorized to delete the workItem
        const workItem = await models_1.WorkItem.findByPk(workItemId);
        if (!workItem) {
            return res.status(404).json({ message: "Work item not found" });
        }
        const boardId = workItem.boardId;
        const userHasAccess = await models_1.UserBoard.findOne({
            where: { userId, boardId },
        });
        if (!userHasAccess) {
            return res
                .status(401)
                .json({ message: "User not authorized to delete work item" });
        }
        const deletedWorkItem = await models_1.WorkItem.destroy({
            where: { id: workItemId },
        });
        res
            .status(201)
            .json({ message: "Work item deleted successfully", deletedWorkItem });
    }
    catch (error) {
        console.error("Error deleting workItem:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteWorkItem = deleteWorkItem;
