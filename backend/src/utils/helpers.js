import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Generates an access token for a user using the given expiration time.
 *
 * @param {Object} user - The user object to include in the access token.
 * @param {number} expiresIn - The number of milliseconds after which the access token expires.
 *
 * @returns {string} The generated access token.
 */
export const generateAccessToken = (user, expiresIn) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: expiresIn.toString()
  });

/**
 * Generates a refresh token for a user using the given expiration time.
 *
 * @param {Object} user - The user object to include in the refresh token.
 * @param {number} expiresIn - The number of milliseconds after which the refresh token expires.
 *
 * @returns {string} The generated refresh token.
 */
export const generateRefreshToken = (user, expiresIn) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: expiresIn.toString()
  });
