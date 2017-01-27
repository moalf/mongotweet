const URL = 'mongodb://USER:PASSWD@localhost:27017/DATABASE';
const PORT = 3000;
const COLLECTION = '<YOUR_COLLECTION>';

var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  var count = 0;
  MongoClient.connect(URL, function(err, db) {
    var collection = db.collection(COLLECTION);
    collection.count(function(err, items){
      count = items; 
      db.close();
      res.render('index', { items : items });
    });
  });
});

app.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
