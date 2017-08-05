// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var google_images = require('google-images');
var client = new google_images('018188286440616364589:3aawccrcupw','AIzaSyDVxGfnUVSqc1AgDI7h1oJd_CbO28xGOHI')
var mongodb = require('mongodb');
var mongo = mongodb.MongoClient;
var url = 'mongodb://porock:samu@ds131583.mlab.com:31583/image_search'

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/imagesearch/:param', function (req,res){
  var time= new Date();
  mongo.connect(url, function(err, db){
    if (err) throw err;
    var data = {
      "term": req.params.param,
      "when": time
    }
    db.collection('history').insert(data, function(err, b) {
      if (err) throw err;
      alert("inserted!!");
      db.close();
    })
  })
  if (!req.query.offset){
    client.search(req.params.param)
      .then( images => res.send(images)
         );
  } else {
    client.search(req.params.param)
    .then( images => res.send(images.slice(0,req.query.offset))
         );
  }
  
})

app.get('/latest/imagesearch', function (req, res){
  mongo.connect(url, function(err, db){
    if (err) throw err;
    db.collection('history').find().sort({when:-1}).limit(10).toArray(function(err,doc){
      if (err) throw err;
      doc.forEach(function(a){
        delete a["_id"];
      })
      res.send(doc);
      db.close;
    });
    
  })
  
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
