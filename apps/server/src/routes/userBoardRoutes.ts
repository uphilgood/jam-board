import * as express from "express";
import { addUserToBoard } from "../controllers/userBoardController";

const router = express.Router();

// Route to create a new board
router.post("/", addUserToBoard);

export default router;
