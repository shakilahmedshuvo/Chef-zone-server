const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors({
//     origin: [
//         'http://localhost:5173',
//         // 'https://cars-doctor-6c129.web.app',
//         // 'https://cars-doctor-6c129.firebaseapp.com'
//     ],
//     credentials: true
// }));
app.use(cors());
app.use(express.json());


//mongodb start 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhesy5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// middlewares 
// const logger = (req, res, next) => {
//     console.log('log: info', req.method, req.url);
//     next();
// }

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // get the database
        const chefCollection = client.db('chefZoneDatabase').collection('chefCollection');

        // get api for chef collection
        app.get("/chefCollection", async (req, res) => {
            const result = await chefCollection.find().toArray();
            res.send(result);
        });

        // get api for chef data by id
        app.get('/chefCollection/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            // const query = { _id: new ObjectId(id) };
            // const query = { id: id };
            const query = {};
            if (req.params.id) {
                query._id = new ObjectId(req.params.id)
            }
            const result = await chefCollection.findOne(query);
            res.send(result);
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
//mongodb end 


app.get('/', (req, res) => {
    res.send('chef is running');
});

app.listen(port, () => {
    console.log(`chef is running on port: ${port}`);
});