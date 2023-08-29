const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());

//DATABASE CONNECTION
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a85bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const likeSetter = (email, list) => {
  let newLikes = [];
  if (list.includes(userEmail)) {
    newLikes = list.filter((x) => x === userEmail);
  } else {
    newLikes = [...list, email];
  }

  return newLikes;
};
async function run() {
  try {
    await client.connect();
    const database = client.db("ridex");
    //USERS COLLECTION
    const usersCollection = database.collection("users");
    const carCollection = database.collection("cars");
    const blogsCollection = database.collection("blogs");
    // const rentedCars = database.collection("rentedCars");

    //GET ALL USERS
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //GET ALL CARS
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //GET ALL BLOGS
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // //GET RENTED CAR LIST
    // app.get("/rent-history", async (req, res) => {
    //   const cursor = rentedCars.find({});
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    //ADD NEW USER
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.json(result);
    });
    //ADD NEW CAR
    app.post("/cars", async (req, res) => {
      const data = req.body;
      const result = await carCollection.insertOne(data);
      res.json(result);
    });
    //ADD NEW BLOG
    app.post("/blogs", async (req, res) => {
      const data = req.body;
      const result = await blogsCollection.insertOne(data);
      res.json(result);
    });

    //GET SPECIFIC USER
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    //GET SPECIFIC CAR
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });
    //GET SPECIFIC BLOG
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    //UPDATE USER
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: update.name,
          email: update.email,
          phone: update.phone,
          time: new Date().toLocaleDateString(),
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //UPDATE CAR
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: update.name,
          year: update.year,
          peopleCapacity: update.peopleCapacity,
          fuelType: update.fuelType,
          mileage: update.mileage,
          transmission: update.transmission,
          rentPrice: update.rentPrice,
        },
      };
      const result = await carCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    //UPDATE BLOG
    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: update.title,
          cover: update.cover,
          category: update.category,
          blog: update.blog,
          time: new Date().toLocaleDateString(),
        },
      };
      const result = await blogsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //DELETE USER
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.json(result);
    });
    //DELETE CAR
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.json(result);
    });
    //DELETE BLOG
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(query);
      res.json(result);
    });

    //RENT A CAR
    app.put("/rent-car/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const { userEmail, fromDate, toDate, paymentMethod } = update;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          rentedBy: {
            userEmail,
            fromDate,
            toDate,
            payment,
            paymentMethod,
          },
        },
      };
      const result = await carCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    //LIKE A CAR
    app.put("/like-car/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const { userEmail } = update;
      const car = await carCollection.findOne(query);
      const existingLikes = car.likes;

      const newLikes = likeSetter(userEmail, existingLikes);

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          likes: newLikes,
        },
      };
      const result = await carCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

//DATABASE RUNNER
app.get("/", (req, res) => {
  res.send("RUNNING WATCH FUSION");
});

app.listen(port, () => {
  console.log("WATCH FUSION ON PORT ", port);
});
