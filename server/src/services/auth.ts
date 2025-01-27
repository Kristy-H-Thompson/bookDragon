import jwt from 'jsonwebtoken';
import  User  from '../models/User';

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization || '';

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.userId);
      req.user = user; // attach user to request
    } catch (err) {
      console.error(err);
    }
  }
  next();
};

export default authMiddleware;