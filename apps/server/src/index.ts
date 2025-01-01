import express = require("express");
import * as dotenv from "dotenv";
import sequelize from "./config/db";
import { setupAssociations } from "./models";
import cors from "cors";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import userBoardRoutes from "./routes/userBoardRoutes";
import workItemRoutes from "./routes/workItemRoutes";
import userRoutes from "./routes/userRoutes";
// import path from 'path';

// const swaggerDocument = YAML.load(path.join(__dirname, '../specs/swagger.yaml'));

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

setupAssociations(); // Setup model associations
const port = process.env.PORT || 4000;

// Debugging: Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Register routes with logging
console.log("Registering routes...");
app.use("/auth", authRoutes);
console.log("/auth registered");

app.use("/boards", boardRoutes);
console.log("/boards registered");

app.use("/userBoards", userBoardRoutes);
console.log("/userBoards registered");

app.use("/workItems", workItemRoutes);
console.log("/workItems registered");

app.use("/users", userRoutes);
console.log("/users registered");

// Fallback middleware for unhandled routes
app.use((req, res) => {
  console.error(`Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ error: "Route not found" });
});

// use getBoards
// app.use("/", boardRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync({ force: false }); // Sync models with the database
    console.log("Database synchronized.");
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
