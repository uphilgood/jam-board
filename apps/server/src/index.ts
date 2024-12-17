import express = require("express");
import * as dotenv from "dotenv";
import sequelize from "./config/db";
import { setupAssociations } from "./models";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import userBoardRoutes from "./routes/userBoardRoutes";
import workItemRoutes from "./routes/workItemRoutes";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

setupAssociations(); // Setup model associations
const port = process.env.PORT || 4000;
// Register auth routes
app.use("/auth", authRoutes); // Routes for /auth/register and /auth/login
// Use board routes
app.use("/boards", boardRoutes);

app.use("/userBoards", userBoardRoutes);
app.use("/workItems", workItemRoutes);

// use getBoards
app.use("/", boardRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync({ force: true }); // Sync models with the database
    console.log("Database synchronized.");
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
