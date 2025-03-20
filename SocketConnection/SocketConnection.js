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

        socket.on('deleteMessage', async (data) => {
            try {
                const { id, room } = data;

                if (!id || !room) {
                    console.error("Invalid data received for deleteMessage:", data);
                    return;
                }

                // Find the room's messages
                const UpdatedMessages = await Messages.findOne({ room });
                if (!UpdatedMessages) {
                    console.error(`No messages found for room: ${room}`);
                    return;
                }

                // Find the message to delete
                const findchat = UpdatedMessages.Data.find((item) => item._id.toString() === id);
                if (!findchat) {
                    console.error(`Message with id: ${id} not found in room: ${room}`);
                    return;
                }

                // Remove the message from the Data array
                UpdatedMessages.Data = UpdatedMessages.Data.filter((item) => item._id.toString() !== id);

                // Save the updated document
                await UpdatedMessages.save();

                // Notify the room about the updated messages
                io.to(room).emit('UpdatedMessages', UpdatedMessages.Data);
            } catch (error) {
                console.error("Error in deleteMessage event:", error);
            }
        });

        socket.on('sendMessage', async (data) => {
            const { text, sender, room } = data;

            try {
                const roomMessages = await Messages.findOneAndUpdate(
                    { room },
                    { $push: { Data: { sender, text, timestamp: new Date() } } },
                    { new: true, upsert: true }
                );
                const updatedData = await Messages.findOne({ room })
                io.to(room).emit('receiveMessage',  updatedData.Data );
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
