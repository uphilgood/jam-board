import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class Board extends Model {}

Board.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "Board" }
);

export default Board;
