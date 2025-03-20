import mongoose from "mongoose";

const MessagesSchema = mongoose.Schema({
    room: { type: String, required: true },
    Data: [{
        sender: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

const Messages = mongoose.model("Table2", MessagesSchema);
export default Messages;
