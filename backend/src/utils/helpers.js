import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const ACCESS_TOKEN_EXPIRATION = "10s";
const REFRESH_TOKEN_EXPIRATION = "1m";

export const generateAccessToken = (user, expiresIn) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: expiresIn.toString()
  });
export const generateRefreshToken = (user, expiresIn) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: expiresIn.toString()
  });

export const hashPassword = (password) => password;

export const unhashPassword = (password) => password;
