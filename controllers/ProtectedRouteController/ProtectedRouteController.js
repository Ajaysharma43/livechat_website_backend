import jwt from 'jsonwebtoken';

export const VerifyRefreshToken = (req, res, next) => {
    const { RefreshToken } = req.body;

    if (!RefreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    jwt.verify(RefreshToken, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ success: false, message: "Invalid or expired refresh token", error: error.message });
        }

        const Payload = { id: decoded.id };
        const AccessToken = jwt.sign(Payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        return res.status(200).json({ success: true, AccessToken : AccessToken });
    });
};