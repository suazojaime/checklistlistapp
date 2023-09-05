const express = require("express");
const AppRouter = require('./routes/notes.routes');
const userroutes = require('./routes/user.routes')
const cors = require("cors");
const http = require("http"); // Import the 'http' module
const socketIo = require("socket.io"); // Import the 'socket.io' module
const { Server } = require("socket.io");
require("dotenv").config();
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app); // Create an HTTP server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/mongo.config');

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
}));

app.use(cookieParser());
app.use('/api/',AppRouter)
app.use('/user', userroutes)

/* notesroutes(app);
userroutes(app) */

// Create a Socket.IO server by passing the HTTP server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  
  socket.on("eventFromClient", (data) => {
    io.emit("updateEvent", data);
    console.log("Received eventFromClient:", data);
    socket.emit("updateEventAcknowledged", "Event received and acknowledged!");
  });
});

server.listen(8000, () => {
  console.log("Server listening!!!!");
});
