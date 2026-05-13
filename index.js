const express = require("express");
const cors = require("cors");
const app = express();
// Load environment variables from .env
require("dotenv").config();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // "wanderlust" নামে database select করা হয়েছে
    const database = client.db("wanderlustdb");

    //  "destination" collection select করা হয়েছে
    const destinationCollection = database.collection("destination");

    // add a new destination
    app.post("/add-destination", async (req, res) => {
      const newDestination = req.body;
      const result = await destinationCollection.insertOne(newDestination);
      console.log(result);
      // Express.js ব্যাকএন্ড হলে:
      res.status(200).json({ message: "new destination added" });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
