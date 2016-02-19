var express = require("express");
var restful = require("node-restful");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var mongoose = restful.mongoose;

/*
var mongolabUser = process.env.DBUSER || "";
var mongolabPass = process.env.DBPASS || "";

mongoose.connect("");
*/

/*var validUserName = process.env.USER || "";
 var validPassword = process.env.PASS || "";*/

var someModel = require("./models/someModel");

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.json({type:"application/json", limit: 1024 * 1024 * 10}));
app.use(cookieParser());
app.use(session({secret:"[insert_generated_secret_here]"}));

app.use(express.static("."));

app.listen(port, function() {
    console.log('The audience is listening...on http://localhost:' + port);
});



