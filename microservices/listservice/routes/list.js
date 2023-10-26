const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const fs = require('fs');
const Prometheus = require('prom-client'); // Import the Prometheus client

// Prometheus error counter
const errorCounter = new Prometheus.Counter({
  name: 'service_errors_total',
  help: 'Total number of errors occurred in the service',
  labelNames: ['service', 'endpoint', 'error_type']
});

// Get database connection string
function getConnectionString() {
  const data = fs.readFileSync('database_ips', 'utf8');
  const ips = data
    .split('\n')
    .filter((ip) => ip !== '')
    .map((ip) => ip.trim());
  return `mongodb://${ips.join(',')}/?replicaSet=rs0`;
}

const url = getConnectionString();

// Fetch all todo list items
router.get('/todos', async (req, res) => {
  try {
    const todos = await fetchAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    errorCounter.inc({ service: 'listService', endpoint: '/todos', error_type: 'FetchError' });
    res.status(500).json({ status: 'Failed to fetch todos' });
  });

// Fetch items from database
async function fetchAllTodos() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db('todo');
    const collection = db.collection('list');
    const todos = await collection.find({}).toArray(); // Fetch all todos from the collection
    return todos;
  } catch (error) {
    console.error('Error fetching all todos:', error);
  } finally {
    client.close();
  }
}

// Add a todo list item
router.post('/add', (req, res) => {
  const item = req.body.text; // Modify to extract the item text
  const obj = {
    text: item,
    completed: false,
  };
  insertInDB(obj);
  res.status(201).json({ status: 'Item added' }); // Return a 201 status code for a successful POST
});

// Insert item into database
async function insertInDB(item) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('todo');
    const collection = db.collection('list');
    await collection.insertOne(item);
  } catch (error) {
    console.error('Error adding item:', error);
    errorCounter.inc({ service: 'listService', endpoint: '/add', error_type: 'AddError' });
    res.status(500).json({ status: 'Failed to add item' });
  } finally {
    client.close();
  }
}

// Remove a todo list item
router.delete('/:id', (req, res) => {
  const itemId = new mongo.ObjectId(req.params.id);

  removeFromDB(itemId);
  res.status(204).json({ status: 'Item removed' }); // Return a 204 status code for a successful DELETE
});

// Remove item from the database
async function removeFromDB(itemId) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('todo');
    const collection = db.collection('list');
    const result = await collection.deleteOne({ _id: itemId });
    if (result.deletedCount === 1) {
      return { success: true, message: 'Item removed' };
    } else {
      return { success: false, message: 'Item not found' };
    }
  } catch (error) {
    console.error('Error removing item:', error);
    errorCounter.inc({ service: 'listService', endpoint: '/delete', error_type: 'DeleteError' });
    res.status(500).json({ status: 'Failed to remove item' });
  } finally {
    client.close();
  }
}

module.exports = router;
