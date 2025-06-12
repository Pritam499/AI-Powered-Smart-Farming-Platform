/**
 * Centralized error handler middleware.
 *
 * Logs the error message to the console.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {undefined} Returns nothing.
 */
export default (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};