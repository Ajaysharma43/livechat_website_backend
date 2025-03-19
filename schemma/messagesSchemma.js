import mongoose from "mongoose";

const MessagesSchema = mongoose.Schema({
    sender: { type: String },
    text: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const Messages = mongoose.model("Table2", MessagesSchema);
export default Messages;