import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";


configDotenv()
const JWT_SECRET = process.env.JWT_SECRET as string;

// @ts-ignore
export const authMiddleware = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'Authorization header is missing or incorrect',
        });
    }

    // Extract the token from the 'Bearer' scheme
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        // console.log("decode", decoded.userId)
        // Attach the decoded userId to the request object for further use

        
        // @ts-ignore
        req.id = decoded.userId ;

        // Proceed to the next middleware
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid or expired token',
        });
    }
};