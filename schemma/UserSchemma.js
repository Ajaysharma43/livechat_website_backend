import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
});

const User = mongoose.model("Table1", UserSchema);
export default User;