import User from "../../schemma/UserSchemma.js";
import jwt from "jsonwebtoken";

export const VerifyUser = async (req, res, next) => {
    try {
        const { formData } = req.body;

        if (!formData || !formData.Email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const Authorize = await User.findOne({ Email: formData.Email });
        if (Authorize) {
            return next();
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, message: "An error occurred" });
    }
};

export const GenerateToken = async (req, res, next) => {
    try {
        const { formData } = req.body;

        if (!formData || !formData.Email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const Authorize = await User.findOne({ Email: formData.Email });
        if (!Authorize) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not defined in environment variables" });
        }

        const Payload = { id: Authorize._id };
        const AccessToken = jwt.sign(Payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        const RefreshToken = jwt.sign(Payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({message : "Verifed" , AccessToken: AccessToken, RefreshToken: RefreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "An error occurred" });
    }
};