import jwt from "jsonwebtoken";

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  console.log("cookies:", req.cookies);
  console.log("signedCookies:", req.signedCookies);
  if (refreshToken) {
    try {
      const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const { iat, exp, ...user } = decodedToken;
      authService.validateRefreshToken(user.id, refreshToken);
      req.user = user;
      return next();
    } catch (err) {
      console.error("Error verifying refresh token:", err);
      return res.status(403).json({ message: "Forbidden" });
    }
  } else {
    console.error("No refresh token provided");
    res.status(403).json({ message: "Forbidden" });
  }
};

export default verifyRefreshToken;
