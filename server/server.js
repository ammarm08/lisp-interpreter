//new relic availability monitoring
require('newrelic');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));


app.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});