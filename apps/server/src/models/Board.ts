import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import WorkItem from "./WorkItem";

// Define the attributes for the Board
interface BoardAttributes {
  id: number;
  name: string;
  description?: string; // Optional field
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes are attributes that Sequelize will auto-generate
interface BoardCreationAttributes
  extends Optional<BoardAttributes, "id" | "createdAt" | "updatedAt"> {}

class Board
  extends Model<BoardAttributes, BoardCreationAttributes>
  implements BoardAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public ownerId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  workItems: any;
}

Board.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Board",
  }
);

export default Board;
