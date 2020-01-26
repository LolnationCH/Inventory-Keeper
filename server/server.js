var express = require('express'),
  app = express(),
  port = process.env.PORT || 6969;

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

var bookRoute = require('./bookRoute');

app.use('/api/books', bookRoute);