require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "jam_board_dev",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "sqlite", // or 'postgres' if you're using Postgres
    storage: "./database.sqlite", // Location of the SQLite file
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "jam_board_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "sqlite",
    storage: "./test.sqlite",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres", // Change this to postgres for production
  },
};
