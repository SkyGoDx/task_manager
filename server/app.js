const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const { taskRouter } = require("./routes/task/task.router");
const { userRouter } = require("./routes/user/user.router");

const app = express();

console.log = function() {}
// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true // Allow credentials
}));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ['GET', 'POST'], // Allowed methods
        credentials: true // Allow credentials (cookies, headers)
    },
});
app.set('socketio', io);

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true } // Add these options for better connection management
);

// Define API routes
app.use("/api", taskRouter);
app.use("/api", userRouter);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('taskUpdate', (data) => {
        io.emit('taskUpdated', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(
    process.env.PORT || 8000,
    () => {
        console.log("Server started on port => ", process.env.PORT || 8000);
    }
);
