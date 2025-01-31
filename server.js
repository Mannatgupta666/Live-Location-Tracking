var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var { Server } = require("socket.io");
var cors = require("cors");  // Import cors package
var io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (update this later for security)
        methods: ["GET", "POST"]
    }
});
var path = require("path");

users = [];
connections = [];

// Use CORS Middleware
app.use(cors());

// Serve static files (this serves the entire folder)
app.use(express.static(path.join(__dirname)));

// Listen on Render's assigned port OR default to 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});

// Routes to serve HTML files
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/maps.html", function (req, res) {
    res.sendFile(path.join(__dirname, "maps.html"));
});

// Handle WebSocket connections
io.on("connection", function (socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // Handle disconnection
    socket.on("disconnect", function () {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });

    // Handle sending messages
    socket.on("send message", function(data) {
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
