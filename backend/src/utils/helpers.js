import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (user, expiresIn) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn });

export const hashPassword = (password) => password;

export const unhashPassword = (password) => password;