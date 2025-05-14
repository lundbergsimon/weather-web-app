import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ').length === 2) {
    const access_token = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(access_token, process.env.JWT_SECRET);
      req.user = decodedToken;
      console.log('Decoded token:', decodedToken);
      return next();
    } catch (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Forbidden' });
    }
  } else {
    console.error('Invalid authorization header:', authHeader);
    res.status(403).json({ message: 'Forbidden' });
  }
};

export default verifyToken;