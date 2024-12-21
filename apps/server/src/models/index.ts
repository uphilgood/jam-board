import User from "./User";
import Board from "./Board";
import WorkItem from "./WorkItem";
import UserBoard from "./UserBoard";

const setupAssociations = () => {
  // models/User.ts
  User.hasMany(UserBoard, { foreignKey: "userId" });
  User.belongsToMany(Board, { through: UserBoard, foreignKey: "userId" });

  // models/Board.ts
  Board.hasMany(UserBoard, { foreignKey: "boardId" });
  Board.hasMany(WorkItem, {
    foreignKey: 'boardId',
    as: 'workItems', 
  });
  Board.belongsToMany(User, { through: UserBoard, foreignKey: "boardId" });

  // models/UserBoard.ts
  UserBoard.belongsTo(User, { foreignKey: "userId" });
  UserBoard.belongsTo(Board, { foreignKey: "boardId" });

  WorkItem.belongsTo(Board, {
    foreignKey: 'boardId', 
    as: 'board',
  });
};

export { User, Board, WorkItem, setupAssociations, UserBoard };
