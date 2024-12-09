import User from "./User";
import Board from "./Board";
import WorkItem from "./WorkItem";

const setupAssociations = () => {
  // A User can have multiple Boards
  User.hasMany(Board, { foreignKey: "userId", as: "boards" });
  Board.belongsTo(User, { foreignKey: "userId", as: "creator" });

  // A Board can have many WorkItems
  Board.hasMany(WorkItem, { foreignKey: "boardId", as: "workItems" });
  WorkItem.belongsTo(Board, { foreignKey: "boardId", as: "board" });

  // A User can create many WorkItems
  User.hasMany(WorkItem, { foreignKey: "createdBy", as: "createdWorkItems" });
  WorkItem.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

  // A User can be assigned to many WorkItems
  User.hasMany(WorkItem, { foreignKey: "assignedTo", as: "assignedWorkItems" });
  WorkItem.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });
};

export { User, Board, WorkItem, setupAssociations };
