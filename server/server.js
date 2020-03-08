var express = require('express'),
  app = express(),
  port = process.env.PORT || 6969;

var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json({limit: '500mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}))
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

// Catch-all request and render webpage
// If this is not used, refresh breaks url routes
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
})