import express from "express";
import { searchUsers, getUser } from "../controllers/userController";

const router = express.Router();

// Route for searching users
router.get("/search", searchUsers);
router.get("/:userId", getUser);

export default router;
