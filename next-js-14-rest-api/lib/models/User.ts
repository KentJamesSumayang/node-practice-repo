import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "@/lib/db"; // Ensure this is your correct Sequelize instance

// Define the interface for User attributes
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

// Define creation attributes (id is optional since it's auto-incremented)
type UserCreationAttributes = Optional<UserAttributes, "id"|"role">

// Extend Sequelize Model
class User extends Model<UserAttributes, UserCreationAttributes> {}

// Initialize Sequelize Model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user", // Default role
        },
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: "User",
        tableName: "users",
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
    }
);

// Export the model
export default User;
