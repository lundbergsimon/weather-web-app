import pool from "../db/db.js";

/**
 * Inserts a refresh token into the database for a given user.
 *
 * @param {number} userId - The ID of the user to insert the refresh token for.
 * @param {string} refreshToken - The refresh token to insert.
 *
 * @returns {Promise<Object>} The inserted refresh token object.
 * @throws Will throw an error if the database query fails.
 */
async function insertRefreshToken(userId, refreshToken) {
  try {
    const results = await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING *",
      [userId, refreshToken]
    );
    if (results.rowCount === 0) {
      throw new Error("Failed to insert refresh token");
    }
    return results.rows[0];
  } catch (error) {
    console.error("Error inserting refresh token:", error);
    throw error;
  }
}

/**
 * Invalidates a refresh token for a given user in the database.
 *
 * @param {number} userId - The ID of the user to invalidate the refresh token for.
 *
 * @throws Will throw an error if the database query fails.
 */
async function invalidateRefreshToken(userId) {
  try {
    await pool.query(
      "DELETE FROM refresh_tokens WHERE user_id = $1",
      [userId]
    );
  } catch (error) {
    console.error("Error invalidating refresh token:", error);
    throw error;
  }
}

/**
 * Validates a refresh token by checking its existence in the database.
 *
 * @param {string} refreshToken - The refresh token to validate.
 *
 * @returns {Promise<number|null>} The user ID associated with the refresh token if it is valid, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
async function validateRefreshToken(refreshToken) {
  try {
    const results = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );
    if (results.rowCount === 0) {
      return null;
    }
    return results.rows[0].user_id;
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
