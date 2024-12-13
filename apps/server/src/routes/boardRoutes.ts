import * as express from "express";
import { createBoard, getBoards } from "../controllers/boardController";

const router = express.Router();

// Route to get all boards for a user
router.get("/", getBoards);

// Route to create a new board
router.post("/", createBoard);

export default router;
