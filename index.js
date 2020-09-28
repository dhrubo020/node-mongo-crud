const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

const password = "ohsd568rQa8Ylrf0";
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://crud:ohsd568rQa8Ylrf0@cluster0.fxpfd.mongodb.net/myDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("myDatabase").collection("myCollection1"); console.log('database connected', err)
    app.post('/addProduct', (req, res) => {
        const product = req.body
        console.log(product)
        collection.insertOne(product)
            .then(result => {
                console.log('data inserted')
                // res.send('success')
                res.redirect('/')
            })
    })

    app.get('/getProduct', (req,res)=>{
        collection.find({})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })
    app.get('/product/:id', (req,res)=>{
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.patch('/update/:id', (req,res)=>{
        collection.updateOne(
            {_id : ObjectId(req.params.id)},
            {
                $set: { price: req.body.price, quantity: req.body.quantity },
                $currentDate : { "lastModified": true }
            }
        )
        .then(result =>{
            console.log(result)
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete('/delete/:id', (req,res)=>{
        console.log(req.params.id)
        collection.deleteOne({_id : ObjectId(req.params.id)})
        .then((result)=>{
            console.log("delete result " , result)
            res.send(result.deletedCount > 0)
        })
    })
    // client.close();
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(3000)