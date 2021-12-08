require("dotenv").config();
require("./src/routes");
const db = require("./src/utils/DB");

db.connect();
