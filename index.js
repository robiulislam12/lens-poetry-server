// External import
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

// Create a app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster1.ftnnc4j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("lensPoetryDB");
    const servicesCollection = database.collection("services");
    const reviewCollection = database.collection("reviews");

    // GET services
    app.get("/services", async (req, res) => {
      const service = await servicesCollection.find({}).toArray();
      res.send(service);
    });
    // GET services only 3 items
    app.get("/servicesItem", async (req, res) => {
      const service = await servicesCollection.find({}).limit(3).toArray();
      res.send(service);
    });
    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });
    // POST services
    app.post("/services", async (req, res) => {
      const data = req.body;
      const service = await servicesCollection.insertOne(data);
      res.send(service);
    });

    // Add a review
    app.post("/review", async (req, res) => {
      const data = req.body;
      const review = await reviewCollection.insertOne(data);
      res.send(review);
    });

    // get a review
    app.get("/review", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      if (req.query.postId) {
        query = {
          postId: req.query.postId,
        };
      }
      const review = await reviewCollection.find(query).sort({time: -1}).toArray();
      res.send(review);
    });

    // Update a review
    app.put("/review/:id", async (req, res) => {
      const id = req.params;
      const filter = { _id: ObjectId(id) };
      const { ratings, comment } = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ratings,
          comment,
        },
      };

      const updateReview = await reviewCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(updateReview);
    });

    // delete review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };

      const deleteReview = await reviewCollection.deleteOne(query);
      res.send(deleteReview);
    });
  } finally {
    // await client.close();
  }
}

run().catch((err) => console.dir(err));

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
