import * as express from "express";

import sequelize from "./config/db";
import { setupAssociations, User, Board, WorkItem } from "./models";

const app = express();
app.use(express.json());

setupAssociations(); // Setup model associations

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync({ force: true }); // Recreate tables
    console.log("Database synchronized.");
    app.listen(4000, () =>
      console.log("Server running on http://localhost:4000")
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
