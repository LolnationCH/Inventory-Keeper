var express = require('express'),
  app = express(),
  port = process.env.PORT || 6969;

var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);

console.log('Inventory Keeper Server started on port : ' + port);

var bookRoute = require('./bookRoute');

// Set the api routes
app.use('/api/books', bookRoute);

app.get('/api', function (req, res) {
  res.send('Server online')
})

// Set the access point
app.use(express.static(__dirname + '/public'));