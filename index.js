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

    // Create an array to store multiple GPS data points
    const gpsDataArray = Array.isArray(gpsData) ? gpsData : [gpsData];

    // Insert multiple documents with GPS data
    const result = await collection.insertMany(gpsDataArray.map(data => ({
      Latitude: data.Latitude,
      Longitude: data.Longitude,
      Date: data.Date,
      Time: data.Time,
      Speed: data.Speed
    })));

    console.log(`GPS data saved to MongoDB. Number of documents inserted: ${result.insertedCount}`);
    res.status(200).json({ status: 'OK', insertedCount: result.insertedCount });
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
  console.log(`Server is running on ${port}`);
});
