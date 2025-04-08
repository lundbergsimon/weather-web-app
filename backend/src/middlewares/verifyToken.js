const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

export default verifyToken;