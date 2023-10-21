const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs")

// Adds/removes todo items from list, and fetches todo items from database to give to frontend service

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

// Fetch all todo list items
router.get('/todos', async (req, res) => {
    try {
        const todos = await fetchAllTodos();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ status: "Failed to fetch todos" }); // Return a 500 status code for a server error
    }
});

// Fetch items from database
async function fetchAllTodos() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db("todo");
        const collection = db.collection("list");
        const todos = await collection.find({}).toArray(); // Fetch all todos from the collection
        return todos;
    } catch (error) {
        console.error("Error fetching all todos:", error);
        throw error;
    } finally {
        client.close();
    }
}

// Add a todo list item
router.post('/add', (req, res) => {
    const item = req.body.text; // Modify to extract the item text
    insertInDB(item);
    res.status(201).json({ status: "Item added" }); // Return a 201 status code for a successful POST
});

// Remove a todo list item
router.delete('/:id', (req, res) => {
    const itemId = req.params.id;
    removeFromDB(itemId);
    res.status(204).json({ status: "Item removed" }); // Return a 204 status code for a successful DELETE
});

// Insert item into database
async function insertInDB(item) {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db("todo");
        const collection = db.collection("list");
        const result = await collection.insertOne(item);
        return result.ops[0]; // Return the added item
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    } finally {
        client.close();
    }
}

// Remove item from the database
async function removeFromDB(itemId) {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db("todo");
        const collection = db.collection("list");
        const result = await collection.deleteOne({ _id: itemId });
        if (result.deletedCount === 1) {
            return { success: true, message: "Item removed" };
        } else {
            return { success: false, message: "Item not found" };
        }
    } catch (error) {
        console.error("Error removing item:", error);
        throw error;
    } finally {
        client.close();
    }
}


module.exports = router;
