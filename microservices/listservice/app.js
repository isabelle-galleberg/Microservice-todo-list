const express = require("express");
const listRoutes = require("./routes/list");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json()); // for parsing application/json
app.use(listRoutes);

module.exports = { app };
