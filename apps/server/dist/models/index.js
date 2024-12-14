"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBoard = exports.setupAssociations = exports.WorkItem = exports.Board = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Board_1 = __importDefault(require("./Board"));
exports.Board = Board_1.default;
const WorkItem_1 = __importDefault(require("./WorkItem"));
exports.WorkItem = WorkItem_1.default;
const UserBoard_1 = __importDefault(require("./UserBoard"));
exports.UserBoard = UserBoard_1.default;
const setupAssociations = () => {
    // models/User.ts
    User_1.default.hasMany(UserBoard_1.default, { foreignKey: "userId" });
    User_1.default.belongsToMany(Board_1.default, { through: UserBoard_1.default, foreignKey: "userId" });
    // models/Board.ts
    Board_1.default.hasMany(UserBoard_1.default, { foreignKey: "boardId" });
    Board_1.default.belongsToMany(User_1.default, { through: UserBoard_1.default, foreignKey: "boardId" });
    // models/UserBoard.ts
    UserBoard_1.default.belongsTo(User_1.default, { foreignKey: "userId" });
    UserBoard_1.default.belongsTo(Board_1.default, { foreignKey: "boardId" });
};
exports.setupAssociations = setupAssociations;
