import jwt from 'jsonwebtoken';

export const TokenVerifyMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const {RefreshToken} = req.body;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token is required" });
        }

        const AccessToken = authHeader.split(" ")[1];

        jwt.verify(AccessToken, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                next();
            }
            else
            {
                jwt.verify(RefreshToken , process.env.JWT_SECRET , (error) => {
                    if(error)
                    {
                        res.status(404).json({success : false})
                    }
                    else
                    {
                        res.status(200).json({success : true})
                    }
                })
            }
            
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during token verification", error: error.message });
    }
};