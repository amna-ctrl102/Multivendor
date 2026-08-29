const app = require("./app");
const connectDatabase = require("./db/database");

// Connect MongoDB
connectDatabase();

module.exports = app;