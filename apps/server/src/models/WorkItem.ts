import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Board from "./Board";
import User from "./User";

class WorkItem extends Model {
  boardId: any;
}

WorkItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("todo", "in-progress", "in-qa", "done"),
      defaultValue: "todo",
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Board,
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "WorkItem" }
);

export default WorkItem;
