import express from "express";
import userService from "../services/user.service.js";
import {
  generateToken,
  hashPassword,
  unhashPassword
} from "../utils/helpers.js";

const router = express.Router();

router.post("/auth/register", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = hashPassword(password);
    userService.createUser(email, hashedPassword);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    existingUser = userService.findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const unhashedPassword = unhashPassword(password);
    if (unhashedPassword !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const refreshToken = generateToken(existingUser, "1d");
    const accessToken = generateToken(existingUser, "15m");

    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    res
      .status(200)
      .json({ message: "Login successful", access_token: accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

router.post("/auth/refresh", (req, res) => {
  res.json({ message: "Refresh successful" });
});

router.get("/forecast", (req, res) => {
  res.json({ message: "Forecast data" });
});

export default router;
