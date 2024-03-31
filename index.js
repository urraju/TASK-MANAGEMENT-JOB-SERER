const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin : ['https://task-managemant-aa29f.web.app','https://task-managemant-aa29f.firebaseapp.com','http://localhost:5173'],
  credentials : true
}))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrkwx23.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const taskCollection = client.db("taskDB").collection("task");

    app.post("/task", async (req, res) => {
      const query = req.body;
      const result = await taskCollection.insertOne(query);
      res.send(result);
    });
    app.get("/task", async (req, res) => {
      const query = req.query?.email;
      const filter = { userEmail: query };
      const result = await taskCollection.find(filter).toArray();
      res.send(result);
    });
     
    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(filter);
      console.log(result);
      res.send(result);
    });
    app.delete(
      "/task/:id",

      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      }
    );
    app.put("/task/updateTask/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const body = req.body;
      const updatedDoc = {
        $set: {
           title: body.title,
           priority: body.priority,
          description: body.description,
          deadline: body.deadline,
          
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Server is Running");
});
app.listen(port, () => {
  console.log("Server is Running on PORT ||", port);
});
