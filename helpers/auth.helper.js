const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwtSecret;

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) return res.status(401).json("No token, authorizaton denied");

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json("Session token expired. Try Again.");
  }
};
