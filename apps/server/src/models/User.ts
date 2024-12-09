import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import * as bcrypt from "bcrypt";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;

  /**
   * Validate the password entered by the user
   * @param plainTextPassword - The raw password entered by the user
   * @returns A boolean indicating whether the password matches
   */
  async validatePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      // This hook runs before a user is created or updated
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10); // Hash the password before saving
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10); // Hash the new password if it has changed
        }
      },
    },
  }
);

export default User;
