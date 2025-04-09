import pool from "../db/db.js";

const findUserByEmail = async (email) => {
  try {
    const results = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);
    if (results.rows.length === 0) {
      return null; // User not found
    }
    return results.rows[0]; // Return the found user
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

const createUser = async (user) => {
  if (!user || !user.email || !user.hashedPassword) {
    throw new Error("User object is invalid");
  }

  try {
    const results = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [user.email, user.hashedPassword]
    );
    return results.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export default { findUserByEmail, createUser };
