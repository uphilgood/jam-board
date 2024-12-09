import * as jwt from "jsonwebtoken";
import { Request, RequestHandler, Response } from "express";
import User from "../models/User";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

/**
 * Registers a new user
 * @route POST /register
 */
export const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, password, email } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Create the new user (password will be hashed via beforeCreate hook in the model)
    const user = await User.create({ username, password, email });
    console.log("user: ", user);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Set the token as a cookie (HTTP-only and secure in production)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};
