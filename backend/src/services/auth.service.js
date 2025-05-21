import pool from "../db/db.js";

async function insertRefreshToken(userId, refreshToken) {
  try {
    const results = await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING *",
      [userId, refreshToken]
    );
    if (results.rowCount === 0) {
      throw new Error("Failed to insert refresh token");
    }
  } catch (error) {
    console.error("Error inserting refresh token:", error);
    throw error;
  }
}

async function invalidateRefreshToken(userId) {
  try {
    const results = await pool.query(
      "DELETE FROM refresh_tokens WHERE user_id = $1 RETURNING *",
      [userId]
    );
    if (results.rowCount === 0) {
      throw new Error("Failed to invalidate refresh token");
    }
  } catch (error) {
    console.error("Error invalidating refresh token:", error);
    throw error;
  }
}

async function validateRefreshToken(userId, refreshToken) {
  try {
    const results = await pool.query(
      "SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2",
      [userId, refreshToken]
    );
    if (results.rowCount === 0) {
      throw new Error("Invalid refresh token");
    }
  } catch (error) {
    console.error("Error validating refresh token:", error);
    throw error;
  }
}

export default {
  insertRefreshToken,
  invalidateRefreshToken,
  validateRefreshToken
};
