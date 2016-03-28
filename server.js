var express = require("express");
var app = express();



app.use(express.static(__dirname + "/app"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));

console.log("Server starting...");
var port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log('The audience is listening...on http://localhost:' + port + "/#/");
});

