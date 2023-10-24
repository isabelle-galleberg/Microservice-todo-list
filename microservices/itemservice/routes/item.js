const express = require('express');
const router = express.Router(); //to handle http routes
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// Checks/unchecks todo item

// Get database connection string
function getMondoDBurl() {
  const data = fs.readFileSync('database_ips', 'utf8'); //! Requires the file database_ips to be set up with ips of our mongodb servers
  const ips = data
    .split('\n')
    .filter((ip) => ip !== '')
    .map((ip) => ip.trim());
  return `mongodb://${ips.join(',')}/?replicaSet=rs0`; // replica set the MongoDB connection string can connect to
}

const url = getMondoDBurl();

// Health check endpoint, checking that service is up
router.get('/health', (req, res) => {
  res.send();
});

// Toggle an item (check/uncheck depending on state)
router.put('/toggle/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedTodo = req.body; // The updatedTodo object sent in the request body

  if (updatedTodo && typeof updatedTodo.completed === 'boolean') {
    const status = updatedTodo.completed; // Toggle the status to be same as input status, assume updatedTodo gives desired new status

    try {
      const result = await updateItemStatus(itemId, status);
      const message = status ? 'Item checked' : 'Item unchecked';
      res.status(200).json({ status: message, result });
    } catch (error) {
      console.error('Error toggling item:', error);
      res.status(500).json({ error: 'Failed to toggle the item' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Update item status in the database
async function updateItemStatus(itemId, status) {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('todo');
    const collection = db.collection('list');
    const query = { _id: itemId };
    const newValues = { $set: { checked: status } };
    const result = await collection.updateOne(query, newValues);

    if (result.modifiedCount === 1) {
      return { success: true, message: 'Item status updated' };
    } else {
      return { success: false, message: 'Item not found or status unchanged' };
    }
  } catch (error) {
    console.error('Error updating item status:', error);
    throw error;
  } finally {
    client.close();
  }
}

module.exports = router;
