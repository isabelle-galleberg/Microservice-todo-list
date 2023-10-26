const express = require('express');
const listRoutes = require('./routes/list');
const cors = require('cors');
const Prometheus = require('prom-client');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json()); // for parsing application/json
app.use(listRoutes);

app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});

module.exports = { app };
