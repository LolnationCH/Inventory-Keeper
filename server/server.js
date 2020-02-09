var express = require('express'),
  app = express(),
  port = process.env.PORT || 6969;

var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

var bookRoute = require('./bookRoute');

app.use('/api/books', bookRoute);

app.get('/api', function (req, res) {
  res.send('Server online')
})

app.use(express.static(__dirname + '/public'));