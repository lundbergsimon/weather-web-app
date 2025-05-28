import express from "express";
import jwt from "jsonwebtoken";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/helpers.js";

const ACCESS_TOKEN_EXPIRATION_MS = 1000 * 60 * 15;
const REFRESH_TOKEN_EXPIRATION_MS = 1000 * 60 * 60 * 24;
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: REFRESH_TOKEN_EXPIRATION_MS
};

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  try {
    const body = req.body;
    if (!body?.email || !body?.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { email, password } = body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: `User with email: '${email}' already exists` });
    }

    // Store the user in the database
    await userService.createUser({ email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = req.body;
    if (!body?.email || !body?.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { email, password } = body;

    // Verify the user's credentials
    const existingUser = await userService.findUserByEmail(email);
    const isPasswordValid = existingUser?.password === password;
    if (!existingUser || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate access and refresh tokens
    const refreshToken = generateRefreshToken(
      existingUser,
      REFRESH_TOKEN_EXPIRATION_MS
    );
    const accessToken = generateAccessToken(
      existingUser,
      ACCESS_TOKEN_EXPIRATION_MS
    );

    // Store the refresh token in the database
    await authService.insertRefreshToken(existingUser.id, refreshToken);

    res.cookie("refresh_token", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(200).json({
      message: "Login successful",
      access_token: accessToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error while logging in" });
  }
});

router.post("/auth/logout", verifyAccessToken, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Clear the refresh token cookie in the user's browser
  res.clearCookie("refresh_token", REFRESH_TOKEN_COOKIE_OPTIONS);

  // Invalidate the refresh token in the database
  authService.invalidateRefreshToken(user.id);

  res.json({ message: "Logout successful" });
});

router.post("/auth/refresh", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refresh_token) return res.sendStatus(401);
    const refreshToken = cookies.refresh_token;

    // Clear the refresh token cookie in the user's browser
    res.clearCookie("refresh_token", REFRESH_TOKEN_COOKIE_OPTIONS);

    // Check for the refresh token in the database
    const userId = await authService.validateRefreshToken(refreshToken);
    if (!userId) {
      return res.sendStatus(403);
    }

    // Verify the refresh token
    const { iat, exp, ...decodedUser } = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        return decoded;
      }
    );

    // Invalidate the old refresh token in the database
    await authService.invalidateRefreshToken(decodedUser.id);

    // Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(
      decodedUser,
      ACCESS_TOKEN_EXPIRATION_MS
    );
    const newRefreshToken = generateRefreshToken(
      decodedUser,
      ACCESS_TOKEN_EXPIRATION_MS
    );

    // Store the new refresh token in the database
    await authService.insertRefreshToken(decodedUser.id, newRefreshToken);

    // Set the new refresh token in the cookie
    res.cookie("refresh_token", newRefreshToken, {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      expires: newRefreshToken.exp * 1000
    });

    // Send the new access token to the client
    res.status(200).json({
      access_token: newAccessToken
    });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/forecast", verifyAccessToken, async (req, res) => {
  try {
    const { lon, lat } = req.query;
    if (!lon || !lat) {
      return res.status(400).json({
        message: "Missing required query parameters: lon and lat"
      });
    }

    // Fetch forecast data from the SMHI API
    const response = await fetch(
      `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
    );
    if (!response.ok) {
      console.error(
        `Failed to fetch forecast data: ${response.status} ${response.statusText}`
      );
      return res.status(500).json({
        message: `Failed to fetch forecast data for lon=${lon}, lat=${lat}`
      });
    }
    const json = await response.json();

    const data = json.timeSeries.map((item) => ({
      datetime: item.validTime,
      temperature: item.parameters.find((param) => param.name === "t"),
      windSpeed: item.parameters.find((param) => param.name === "ws"),
      windDirection: item.parameters.find((param) => param.name === "wd")
    }));
    res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error while fetching forecast data"
    });
  }
});

export default router;
