// const jwt = require("jsonwebtoken");

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return null;
//   }
// }
//THE ABOVE IS ES SYNTAX, BELOW IS COMMONJS SYNTAX
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { verifyToken };
// This function verifies a JWT token using the secret key from environment variables.
// If the token is valid, it returns the decoded payload; otherwise, it returns null.
