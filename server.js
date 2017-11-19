var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoHost = "mongodb://localhost/dropper";
var morgan = require('morgan');

var app = express();

app.use(morgan('combined'));

mongoose.connect(mongoHost, {useMongoClient: true});
mongoose.connection.on('error', function(err) {
    if (err) console.log('MongoDB Error: ', err);
});

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

require('./app/routes/routes.js')(app);

var port = process.env.PORT || 8080;
var server = app.listen(port);
console.log('Running on port ', port, '...');

// Expose app
exports.server = server;
exports.app = app;
