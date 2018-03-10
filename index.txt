var express = require('express');
var app = express();
var port = 8888;

var dbURL = "localhost:27017/testdb";
var collections = ["table"];
var db = require("mongojs").connect(dbURL, collections);

var io = require("socket.io").listen(app.listen(port));

console.log("Server started.")
var connections = 0;
var messages = [];

io.sockets.on("connection", function (socket) {
    console.log("New Socket: " + (connections + 1));
    connections++;

    var count = 0;
    var ping = 0;

    var query = {
        messages: { $exists: true }
    };

    var fields = {};

    if (connections === 1) {
        messages = [];
        db.table.find(query, fields, function (err, records) {
            if (err) console.log(err);
            if (records && records[0]) {
                messages = records[0].messages;
                socket.emit("sync", messages);
            }
        });
    }
    else {
        socket.emit("sync", messages);
    }
    //socket.emit("message", { message: "Welcome to the chat."});

    setInterval(function () {
        ping = Date.now();
        socket.emit("ping", count++);
    }, 500);

    socket.on("pong", function () {
        console.log("pong " + (Date.now() - ping) + "ms");
    });

    socket.on("send", function (data) {
        messages.push(data);
        console.log(data.message);
     //   socket.broadcast("message", data);
        io.sockets.emit("message", data);
    });

    socket.on("disconnect", function () {
        console.log("Disconnected: " + (--connections));
        if (connections === 0) {
            db.table.update(query, { messages: messages }, {upsert: true});
        }
    });
});