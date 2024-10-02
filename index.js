const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000 ;
const { ObjectId } = require('mongodb');


app.use(cors()) ;
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.SECRET_KEY_NAME}:${process.env.SECRET_KEY_PASSWORD}@cluster0.ywq3nhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const userCollection = client.db('usersDB2024').collection('users')


    app.get('/users', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.delete('/users/:id', async (req, res) => {
      const deleteUser = req.params.id;
      console.log(deleteUser);
      
      // Convert the string id to ObjectId
      const query = { _id: new ObjectId(deleteUser) };
      
    
      try {
        const result = await userCollection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.send({ message: 'User deleted successfully' });
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error });
      }
    });


    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        console.log(user);
        
        const result = await userCollection.insertOne(user);  // Use await for async operation
        res.send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ error: "An error occurred while inserting the user." });
      }
    });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})