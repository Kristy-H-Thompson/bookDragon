import jwt from 'jsonwebtoken';
import User from '../models/User';
const authMiddleware = async (req, next) => {
    const token = req.headers.authorization || '';
    if (token) {
        try {
            // Add type assertion here to specify the decoded payload type
            const decoded = jwt.verify(token, 'your-secret-key');
            // Find the user by the decoded userId
            const user = await User.findById(decoded.userId);
            req.user = user; // Attach user to the request object
        }
        catch (err) {
            console.error(err);
        }
    }
    next();
};
export default authMiddleware;
