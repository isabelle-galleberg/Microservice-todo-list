const express = require('express');
const router = express.Router(); //to handle http routes
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs")

// Get database connection string
function getConnectionString() {
    const data = fs.readFileSync('database_ips', 'utf8'); //! Requires the file database_ips to be set up with ips of our mongodb servers
    const ips = data.split('\n').filter((ip) => ip !== "").map(ip => ip.trim());
    return `mongodb://${ips.join(",")}/?replicaSet=rs0`; // replica set the MongoDB connection string can connect to 
}

const url = getConnectionString();


// Health check endpoint, checking that service is up
router.get('/health', (req, res) => {
    res.end();
});

// Check an item //!NB these expect an id param in URL to update item status
router.put('/check/:id', (req, res) => {
    const itemId = req.params.id;
    updateItemStatus(itemId, true);
    res.json({ status: "Item checked" });
});

// Uncheck an item
router.put('/uncheck/:id', (req, res) => {
    const itemId = req.params.id;
    updateItemStatus(itemId, false);
    res.json({ status: "Item unchecked" });
});

// Update item status in the database
function updateItemStatus(itemId, status) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("todo"); //TODO change to correct name once db has name
        const query = { _id: itemId };
        const newValues = { $set: { checked: status } };
        dbo.collection("list").updateOne(query, newValues, function (err) {
            if (err) throw err;
            console.log("1 item updated");
            db.close();
        });
    });
}

module.exports = router;
