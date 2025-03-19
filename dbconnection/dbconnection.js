import mongoose from "mongoose"

const DBConnection = () => {
    try
    {
        mongoose.connect(`${process.env.DB_CONNECTION_STRING}`)
    .then(() => console.log("conneted successfully"))
    }
    catch(error)
    {
        console.log(error)
    }
}

export default DBConnection;