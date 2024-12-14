"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const Board_1 = __importDefault(require("./Board"));
const User_1 = __importDefault(require("./User"));
class WorkItem extends sequelize_1.Model {
}
WorkItem.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING },
    status: {
        type: sequelize_1.DataTypes.ENUM("todo", "in-progress", "in-qa", "done"),
        defaultValue: "todo",
    },
    boardId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Board_1.default,
            key: "id",
        },
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.default,
            key: "id",
        },
    },
    assignedTo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User_1.default,
            key: "id",
        },
    },
}, { sequelize: db_1.default, modelName: "WorkItem" });
exports.default = WorkItem;
