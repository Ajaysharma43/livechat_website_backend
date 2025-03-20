import express from "express";
import cors from "cors";
import UploadFileRoute from "./routes/AddFileRoute/AddFIleRoute.js";
import AuthRoute from "./routes/Authroutes/AuthRoute.js"
import TokenVerify from './routes/TokenVerify/TokenVerify.js'
import Messages from "./schemma/messagesSchemma.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import DBConnection from "./dbconnection/dbconnection.js";
import SocketConnection from "./SocketConnection/SocketConnection.js";

dotenv.config();
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Configure CORS properly
app.use(cors('*'));

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
app.use('/verify' , TokenVerify)
// WebSocket events
SocketConnection(io)

// Start only one server on port 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
