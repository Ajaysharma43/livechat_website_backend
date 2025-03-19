export const GenerateNewToken = (req , res , next) => {
 const { RefreshToken } = req.body;

    if (!RefreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    jwt.verify(RefreshToken, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.status(498).json({success : false})
        }
        else
        {
            const Payload = { id: decoded.id };
            const AccessToken = jwt.sign(Payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    
            return res.status(200).json({ success: true, AccessToken : AccessToken });
        }
    });
}