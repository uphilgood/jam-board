import * as express from "express";
import { createBoard, getBoards, deleteBoard } from "../controllers/boardController";

const router = express.Router();

// Route to get all boards for a user
router.get("/", getBoards);

// Route to create a new board
router.post("/", createBoard);

// Route to delete a new board
router.delete("/", deleteBoard);

export default router;
