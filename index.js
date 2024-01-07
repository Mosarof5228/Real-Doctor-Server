require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
//Real-Doctor
//EfDondgPEr02rebi

console.log(process.env.DB_User)
console.log(process.env.DB_Pass)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.cqf2amb.mongodb.net/?retryWrites=true&w=majority`;


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


        const serviceCollection = client.db('doctor-service').collection('services')

        const bookingsCollection = client.db('doctor-service').collection('bookings')

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/bookings', async (req, res) => {
            console.log(req.query.email)
            query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = bookingsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })



        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);
            res.send(result);
        })








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
    res.send('Real Doctor Server is running')
})
app.listen(port, () => {
    console.log(`server is running on PORT: ${port}`)
})
