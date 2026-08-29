const app = require("./app");
const connectDatabase = require("./db/Database");

// Connect MongoDB
connectDatabase();

module.exports = app;