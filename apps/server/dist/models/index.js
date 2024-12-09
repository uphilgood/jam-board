"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = exports.WorkItem = exports.Board = exports.User = void 0;
var User_1 = require("./User");
exports.User = User_1.default;
var Board_1 = require("./Board");
exports.Board = Board_1.default;
var WorkItem_1 = require("./WorkItem");
exports.WorkItem = WorkItem_1.default;
var setupAssociations = function () {
    // A User can have multiple Boards
    User_1.default.hasMany(Board_1.default, { foreignKey: "userId", as: "boards" });
    Board_1.default.belongsTo(User_1.default, { foreignKey: "userId", as: "creator" });
    // A Board can have many WorkItems
    Board_1.default.hasMany(WorkItem_1.default, { foreignKey: "boardId", as: "workItems" });
    WorkItem_1.default.belongsTo(Board_1.default, { foreignKey: "boardId", as: "board" });
    // A User can create many WorkItems
    User_1.default.hasMany(WorkItem_1.default, { foreignKey: "createdBy", as: "createdWorkItems" });
    WorkItem_1.default.belongsTo(User_1.default, { foreignKey: "createdBy", as: "creator" });
    // A User can be assigned to many WorkItems
    User_1.default.hasMany(WorkItem_1.default, { foreignKey: "assignedTo", as: "assignedWorkItems" });
    WorkItem_1.default.belongsTo(User_1.default, { foreignKey: "assignedTo", as: "assignee" });
};
exports.setupAssociations = setupAssociations;
