const express = require('express');
const itemRoutes = require('./routes/item');
const cors = require('cors'); // for security in web requests
const Prometheus = require('prom-client');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json()); // for parsing application/json
app.use(itemRoutes);

app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});

module.exports = { app };
