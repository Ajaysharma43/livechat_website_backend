import express from "express";
import cors from "cors";
import UploadFileRoute from "./routes/AddFileRoute/AddFIleRoute.js";
import dotenv from "dotenv";
import http from 'http'
import { Socket , Server } from "socket.io";
import { log } from "console";

const app = express();

const server = http.createServer(app)
const io = new Server(server , {
    cors : {
        origin : `${process.env.CLIENT_SIDE}`,
        methods : ["GET" , "POST"]
    }
})

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'));
app.use('/Upload', UploadFileRoute);

io.on('connection' , (socket) => {
    console.log(`socket is ${socket.id}`)

    socket.on('sendMessage' , (data) => {
        io.emit('receiveMessage' , data)
    })

    socket.on('typing' , (username) => {
        socket.broadcast.emit("userTyping" , username)
    })

    socket.on('stopTyping' , (username) => {
        socket.broadcast.emit("userStoppedTyping" , username)
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });

})
server.listen(4000, () => console.log("Server running on port 3000"));
app.listen(3000, () => console.log('port running on port 3000'));