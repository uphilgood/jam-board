"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = __importStar(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const models_1 = require("./models");
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
dotenv.config(); // Load environment variables
const app = express();
app.use((0, cors_1.default)());
app.use(express.json()); // Parse JSON request bodies
(0, models_1.setupAssociations)(); // Setup model associations
const port = process.env.PORT || 4000;
// Register auth routes
app.use("/auth", authRoutes_1.default); // Routes for /auth/register and /auth/login
// Use board routes
app.use("/boards", boardRoutes_1.default);
// use getBoards
app.use("/", boardRoutes_1.default);
const startServer = async () => {
    try {
        await db_1.default.authenticate();
        console.log("Database connected.");
        await db_1.default.sync({ force: true }); // Sync models with the database
        console.log("Database synchronized.");
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
startServer();
