var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var app = express();


//mongoose.connect('mongodb://localhost:27017/zork');

app.use(express.static(__dirname + "/app"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

console.log("Server starting...");
var port = process.env.PORT || 8080;

var Room = mongoose.model("Room", {
    name: String
});

app.get("/api/rooms", function (req, res) {
    Room.find(function (err, rooms) {

        if (err) {
            res.send(err);
        }
        res.json(rooms);

    });
});
app.post("/api/rooms", function (req, res) {
    Room.create({
        name: req.body.name
    }, function (err, room) {

        if (err) {
            res.send(err);
        }

        res.json(room);

    });
});

app.delete("/api/rooms/:room_id", function (req, res) {
    Room.remove({
        _id: req.params.room_id
    }, function (err, room) {
        if (err) {
            res.send(err);
        }
        res.sendStatus(200);
    });
});


app.listen(port, function () {
    console.log('The audience is listening...on http://localhost:' + port + "/#/");
});

