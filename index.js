const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
console.log(process.env.DB_USER);
const port = process.env.PORT || 5055;



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7m4gn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error',err);
  const serviceCollection = client.db("wedco").collection("service");
  const orderCollection = client.db("wedco").collection("order");
  const adminCollection = client.db("wedco").collection("admin");
  const reviewCollection = client.db("wedco").collection("review");
  app.get('/service', (req, res)=>{
     serviceCollection.find()
     .toArray((err,items)=>{
         res.send(items);
     })
  })
  app.get('/service/:id',(req,res)=>{
    serviceCollection.find({id: req.params.id})
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database',items);
    })
  })


  app.post('/addService', (req,res)=>{
      const newEvent = req.body;
     
      serviceCollection.insertOne(newEvent)
      .then(result=>{
         
          res.send(result.insertedCount>0)
      })
  })


  app.post('/addOrder',(req,res)=>{
    const order =req.body;
    orderCollection.insertOne(order)
    .then(result => {
      console.log('inserted count:',result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })
  app.get('/orderList',(req,res)=>{
    orderCollection.find()
    .toArray((err,items)=>{
      res.send(items)
      console.log('from database',items);
      
    })
  })
  app.get('/orderByEmail',(req,res)=>{
    const email =req.query.email;
    console.log(email);
    orderCollection.find({email: email})
    .toArray((err,items)=>{
      res.send(items)
    })
    
  })
  app.get('/admin', (req, res)=>{
    adminCollection.find({})
    .toArray((err,items)=>{
        res.send(items);
    })
 })


 app.post('/addAdmin', (req,res)=>{
     const newAdmin = req.body;
     console.log('adding new event', newAdmin);
     adminCollection.insertOne(newAdmin)
     .then(result=>{
         console.log(result.insertedCount)
         res.send(result.insertedCount>0)
     })
 })
 app.post('/addReview',(req,res)=>{
   const newReview = req.body;
   console.log('adding new review',newReview);
   reviewCollection.insertOne(newReview)
   .then(result=>{
     console.log(result.insertedCount)
     res.send(result.insertedCount>0)
   })
 })
 app.get('/review', (req, res)=>{
  reviewCollection.find({})
  .toArray((err,items)=>{
      res.send(items);
  })
})

app.get('/isAdmin',(req,res)=>{
  const email = req.query.email;
  console.log(email);
  adminCollection.find({ email: email})
  .toArray((err,items)=>{
    res.send(items.length>0)
  })
})

  console.log('db connected');
  // perform actions on the collection object
//   client.close();
});


app.listen(port)