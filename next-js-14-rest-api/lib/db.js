import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// ✅ Initialize Sequelize with MySQL
export const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, // Database Name
    process.env.MYSQL_USER, // Database User
    process.env.MYSQL_PASSWORD, // Database Password
    {
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        dialectModule: mysql2 ,
        logging: false, // Disable logging SQL queries (optional)
        pool: {
            max: 10, // Max connections
            min: 0,  // Min connections
            acquire: 30000, // Timeout before error
            idle: 10000, // Release connection after inactivity
        },
    }
);

// ✅ Test DB Connection
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1); // Stop the server if DB fails
    }
};
