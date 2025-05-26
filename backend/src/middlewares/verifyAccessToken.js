import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Verify that the request has a valid access token by checking the Authorization
 * header. If the access token is valid, store the user object in the request.
 * If the access token is invalid or missing, return a 403 Forbidden response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ').length === 2) {
    const accessToken = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decodedToken;
      return next();
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: 'Forbidden' });
    }
  } else {
    console.error('Invalid authorization header:', authHeader);
    res.status(403).json({ message: 'Forbidden' });
  }
};

export default verifyAccessToken;