const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Set your desired port

// Define MongoDB Atlas connection URI
const mongoUri = 'mongodb+srv://Abdullah:abdullah123@mernapp.i1s0mmx.mongodb.net/';

let client; // Declare the client variable at a broader scope

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to handle incoming GPS data
app.post('/gpsdata', async (req, res) => {
  const gpsData = req.body;

  try {
    // Connect to MongoDB Atlas
    client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the database and collection
    const database = client.db('Sweeper_Monitoring'); // Replace with your actual database name
    const collection = database.collection('Sample');

    // Create a new document with GPS data
    const result = await collection.insertOne({
      latitude: gpsData.latitude,
      longitude: gpsData.longitude,
      date: gpsData.date,
      time: gpsData.time
    });

    console.log(`GPS data saved to MongoDB. Document ID: ${result.insertedId}`);
    res.status(200).json({ status: 'OK', insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Internal Server Error', error: error.message });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
});

// Sample API endpoint for testing
app.get('/test', (req, res) => {
  res.json({ message: 'Server is up and running!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
