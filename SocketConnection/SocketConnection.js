import Messages from "../schemma/messagesSchemma.js";

const SocketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', async (roomid) => {
            console.log(`Socket ${socket.id} joined the room: ${roomid}`);
            socket.join(roomid);

            try {
                let roomMessages = await Messages.findOne({ room: roomid });
                if (!roomMessages) {
                    roomMessages = new Messages({ room: roomid, Data: [] });
                    await roomMessages.save();
                }

                socket.emit('previousMessages', roomMessages.Data);
            } catch (error) {
                console.log(error);
            }

            socket.to(roomid).emit('userJoined', { userId: socket.id, room: roomid });
        });

        socket.on('typing', ({ room, username }) => {
            socket.to(room).emit('userTyping', username);
        });

        // Handle stop typing event
        socket.on('stopTyping', ({ room, username }) => {
            socket.to(room).emit('userStoppedTyping', username);
        });

        socket.on('sendMessage', async (data) => {
            const { text, sender, room } = data;

            try {
                const roomMessages = await Messages.findOneAndUpdate(
                    { room },
                    { $push: { Data: { sender, text, timestamp: new Date() } } },
                    { new: true, upsert: true }
                );

                io.to(room).emit('receiveMessage', { sender, text, timestamp: new Date() });
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on('leaveRoom', (roomid) => {
            console.log(`Socket ${socket.id} left the room: ${roomid}`);
            socket.leave(roomid);
            socket.to(roomid).emit('userLeft', { userId: socket.id, room: roomid });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default SocketConnection;
