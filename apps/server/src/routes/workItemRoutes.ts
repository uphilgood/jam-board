import * as express from "express";
import {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
} from "../controllers/workItemController";

const router = express.Router();

router.get("/", getWorkItems);
router.post("/", createWorkItem);
router.put("/", updateWorkItem);

export default router;
