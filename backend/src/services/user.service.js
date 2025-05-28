import pool from "../db/db.js";

/**
 * Finds a user in the database by their email address.
 *
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
const findUserByEmail = async (email) => {
  try {
    const results = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);
    if (results.rows.length === 0) {
      return null;
    }
    return results.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Creates a new user in the database.
 *
 * @param {Object} user - The user object containing the user's details.
 * @returns {Promise<Object>} The created user object.
 * @throws Will throw an error if the database query fails.
 */
const createUser = async (user) => {
  if (!user || !user.email || !user.password) {
    throw new Error("User object is invalid");
  }

  try {
    const results = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [user.email, user.password]
    );
    return results.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export default { findUserByEmail, createUser };
