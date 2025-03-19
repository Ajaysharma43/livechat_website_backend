import User from "../../schemma/UserSchemma.js";


export const CheckUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        const Existed = await User.findOne({ Email: formData.Email })
        if (Existed) {
            return res.status(200).json({ message: "already Existed", Data: Existed , success : false})
        }
        else {
            return next()
        }
    }
    catch (error) {
        return res.status(404).json({ message: "use not found", error: error })
    }
}



export const VerifyUsername = async (req, res, next) => {
    try {
        const { formData } = req.body;

        if (!formData.Username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const Existed = await User.findOne({ Username : formData.Username });
        if (Existed) {
            return res.status(200).json({ message: "Username already exists", Data: Existed , success : false });
        } else {
            return next()
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};



export const AddUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        console.log("called")
        const UserData = { Username: formData.Username, Email: formData.Email, Password: formData.Password }
        const SaveData = new User(UserData)
        await SaveData.save()
        return res.status(200).json({message : "user created successfully" ,  success: true })
    }
    catch (error) {
        return res.status(404).json({ message: error })
    }

}