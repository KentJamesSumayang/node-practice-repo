import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "@/lib/db"; // Ensure this is your Sequelize instance
import User from "./User.model"; // Import the User model

// Define attributes for Category
interface CategoryAttributes {
    id: number;
    title: string;
    user_id: number; // Foreign key reference to User
}

// Define creation attributes (id is optional because it's auto-incremented)
type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

// Extend Sequelize Model
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {}

// Initialize Category model
Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true, // Enables createdAt & updatedAt
    }
);

// Define relationships
User.hasMany(Category, { foreignKey: "user_id", as: "categories" });
Category.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Category;
