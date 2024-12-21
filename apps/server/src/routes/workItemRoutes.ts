import * as express from "express";
import {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
} from "../controllers/workItemController";

const router = express.Router();

router.get("/", getWorkItems);
router.post("/", createWorkItem);
router.put("/", updateWorkItem);
router.delete("/", deleteWorkItem);

export default router;
