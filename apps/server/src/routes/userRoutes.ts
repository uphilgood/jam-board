import express from "express";
import { searchUsers } from "../controllers/userController";

const router = express.Router();

// Route for searching users
router.get("/search", searchUsers);

export default router;
