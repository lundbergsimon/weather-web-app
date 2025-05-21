import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const ACCESS_TOKEN_EXPIRATION = "10s";
const REFRESH_TOKEN_EXPIRATION = "20s";

export const generateAccessToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION
  });
export const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION
  });

export const hashPassword = (password) => password;

export const unhashPassword = (password) => password;
