import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * Creates a signed JWT token for user authentication
 *
 * @param {String} userId - MongoDB user ID
 * @returns {String} - JWT token valid for 7 days
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken;
