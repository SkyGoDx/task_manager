const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const { taskRouter } = require("./routes/task/task.router");
const { userRouter } = require("./routes/user/user.router");
var path = require("path")
const app = express();

console.log = function() {}
// Middleware
app.use(cors({
    origin: "*", // Allow requests from this origin
    credentials: true // Allow credentials
}));
app.use(express.json());
app.use(express.static(path.join(__dirname ,"dist")));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow requests from this origin
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


app.get("/*", (req, res) => {
    return res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  // Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// server build
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
