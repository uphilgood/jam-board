import * as express from "express";
import {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem,
  getWorkItemsByBoardId
} from "../controllers/workItemController";

const router = express.Router();

router.get("/", getWorkItems);
router.get("/items", getWorkItemsByBoardId);
router.post("/", createWorkItem);
router.put("/", updateWorkItem);
router.delete("/", deleteWorkItem);

export default router;
