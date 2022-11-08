// External import
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

// Create a app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster1.ftnnc4j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const database = client.db('lensPoetryDB');
    const servicesCollection = database.collection('services');

    // GET services
    app.get('/services', async(req, res)=>{
      const service = await servicesCollection.find({}).toArray();
      res.send(service);
    })
    // GET services only 3 items
    app.get('/servicesItem', async(req, res)=>{
      const service = await servicesCollection.find({}).limit(3).toArray();
      res.send(service);
    })
    // POST services
    app.post('/services', async(req, res)=>{
      const data = req.body;
      const service = await servicesCollection.insertOne(data);
      res.send(service);
    })


  }
  finally{
    // await client.close();
  }
}

run().catch(err => console.dir(err))

// Routes
app.get("/health", (req, res) => {
  res.json({ message: "Server health is good" });
});
app.get("/", (req, res) => {
  res.send("<h1>Server Side is running</h1>");
});

// App listen on http://localhost:5000
app.listen(port, () => {
  console.log("server is running on port", port);
});