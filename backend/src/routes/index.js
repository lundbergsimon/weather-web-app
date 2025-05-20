import express from "express";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.js";
import verifyToken from "../middlewares/verifyToken.js";
import userService from "../services/user.service.js";
import {
  generateToken,
  hashPassword,
  unhashPassword
} from "../utils/helpers.js";

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

    const hashedPassword = hashPassword(password);
    await userService.createUser({ email, hashedPassword });

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

    const existingUser = await userService.findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const unhashedPassword = unhashPassword(password);
    if (unhashedPassword !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const refreshToken = generateToken(existingUser, "1d");
    const accessToken = generateToken(existingUser, "15m");

    console.log("Access token:", accessToken);
    console.log("Refresh token:", refreshToken);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
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

router.post("/auth/refresh", verifyRefreshToken, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const newAccessToken = generateToken(user, "15m");
  res
    .status(200)
    .json({ message: "Login successful", access_token: newAccessToken });
});

router.get("/forecast", verifyToken, async (req, res) => {
  const { lon, lat } = req.query;
  if (!lon || !lat) {
    return res
      .status(400)
      .json({ message: "Longitude and latitude are required" });
  }

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
  console.log(json);

  const data = json.timeSeries.map((item) => ({
    datetime: item.validTime,
    temperature: item.parameters.find((param) => param.name === "t"),
    windSpeed: item.parameters.find((param) => param.name === "ws"),
    windDirection: item.parameters.find((param) => param.name === "wd")
  }));
  res.json({ message: "Forecast data", data: data });
});

export default router;
