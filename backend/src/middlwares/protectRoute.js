import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ENV_VARS } from '../config/envVars.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies['jwt-netflix']; // Get the token from the cookies
        if (!token) {
            return res.status(401).json({ success:false,  message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET); // Verify the token
        if(!decoded) {
            return res.status(401).json({ success:false, message: "Unauthorized - Invalid Token" });
        }
        const user = await User.findById(decoded.userId).select("-password"); // Find the user associated with the token
        if(!user) {
            return res.status(401).json({ success:false, message: "Unauthorized - User Not Found" });
        }
        req.user = user; // Attach the user to the request object
        
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ success:false, message: "Internal Server Error" });   
        
    }
};