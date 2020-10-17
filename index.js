const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flieUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhrx7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('addService'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Hello I am Database")
})

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("OrderPlaceNow");
  const reviewCollection = client.db("creativeAgency").collection("reviews");
  const addServiceCollection = client.db("creativeAgency").collection("addService");



     app.post('/customerOrder', (req, res) => {
        const { name, email, title, description, price } = req.body;
        orderCollection.insertOne({ name, email, title, description, price})
        .then(result => {
         res.send(result.insertedCount > 0);

         })
    })

 
    app.get('/customerService/:email', (req, res) => {
        const userEmail = req.params.email;
        orderCollection.find({ email: userEmail })
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })


    app.post('/customerReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/adminAddService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const newImg = file.data
        const enImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer(enImg, 'base64')
        };

        
        addServiceCollection.insertOne({ name, email, image})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
      
           
      })
  




})






app.listen(process.env.PORT || port)