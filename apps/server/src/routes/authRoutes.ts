import { Router } from "express";
import { login, register } from "../controllers/authController";

const router = Router();

// Route to register a new user
router.post("/register", register);

// Route to log in an existing user
router.post("/login", login);

export default router;
