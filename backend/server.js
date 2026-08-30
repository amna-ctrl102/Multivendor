require("dotenv").config({
  path: `${__dirname}/config/.env`,
});

const app = require("./app");
const connectDatabase = require("./db/database");

// Connect MongoDB
connectDatabase();

// Export Express app for Vercel
module.exports = app;