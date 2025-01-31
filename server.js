var express = require("express");
var app = express();
var server = require("http").createServer(app);
var { Server } = require("socket.io");
var io = new Server(server);
var path = require("path");

users = [];
connections = [];

server.listen(process.env.PORT || 8080, () => {
    console.log("Server running on port 8080...");
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/maps.html", function (req, res) {
    res.sendFile(path.join(__dirname, "maps.html")); // Ensure this path matches the location of your maps.html file
});

// Handle socket connections
io.on("connection", function (socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // Handle disconnection
    socket.on("disconnect", function () {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });

    // Handle sending messages
    socket.on("send message", function(data){
        console.log(data);
        io.sockets.emit("new message", { msg: data });
    });

    // Handle sending location data
    socket.on("send location", function(locationData) {
        console.log("Received location:", locationData);
        // Broadcast the location data to all clients to update their map markers
        io.sockets.emit("update location", locationData);
    });
});
