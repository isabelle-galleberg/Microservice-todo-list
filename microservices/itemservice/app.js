const express = require('express');
const itemRoutes = require('./routes/item');
const cors = require('cors'); // for security in web requests

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json()); // for parsing application/json
app.use(itemRoutes);

module.exports = { app };
