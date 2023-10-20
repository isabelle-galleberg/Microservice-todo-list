const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs")

// Get database connection string
function getConnectionString() {
    const data = fs.readFileSync('database_ips', 'utf8');
    const ips = data.split('\n').filter((ip) => ip !== "").map(ip => ip.trim());
    return `mongodb://${ips.join(",")}/?replicaSet=rs0`;
}

const url = getConnectionString();
console.log(url);

// Health check endpoint
router.get('/health', (req, res) => {
    res.end();
});

// Add a todo list item
router.post('/add', (req, res) => {
    const item = req.body.item;
    insertInDB(item, 'add');
    res.json({ status: "Item added" });
});

// Remove a todo list item
router.delete('/remove/:id', (req, res) => {
    const itemId = req.params.id;
    removeFromDB(itemId);
    res.json({ status: "Item removed" });
});

// Insert item into database
function insertInDB(item, operation) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("todo");
        if (!dbo.collection('list')) dbo.createCollection("list");
        const myobj = { item, operation };
        dbo.collection("list").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 entry inserted");
            db.close();
        });
    });
}

// Remove item from database
function removeFromDB(itemId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("todo");
        const query = { _id: itemId };
        dbo.collection("list").deleteOne(query, function (err, obj) {
            if (err) throw err;
            console.log("1 entry deleted");
            db.close();
        });
    });
}

module.exports = router;
