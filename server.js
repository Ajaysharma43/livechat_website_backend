import express from "express";
import cors from "cors";
import UploadFileRoute from "./routes/AddFileRoute/AddFIleRoute.js";
import AuthRoute from "./routes/Authroutes/AuthRoute.js"
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import DBConnection from "./dbconnection/dbconnection.js";

dotenv.config();
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Configure CORS properly
app.use(cors({
    origin: process.env.CLIENT_SIDE || "http://localhost:3000", // Adjust as needed
    methods: ["GET", "POST"],
    credentials: true,
}));

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE,
        methods: ["GET", "POST"],
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConnection()

// Routes
app.use('/Upload', UploadFileRoute);
app.use('/Auth' , AuthRoute)
// WebSocket events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit("userTyping", username);
    });

    socket.on('stopTyping', (username) => {
        socket.broadcast.emit("userStoppedTyping", username);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start only one server on port 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
