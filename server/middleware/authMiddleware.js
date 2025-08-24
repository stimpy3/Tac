const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // console.log("authMiddleware triggered"); //<-- add this
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token received:", token); //<-- add this
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded);//<-- add this
    req.user =  { id: decoded.userId };
    next();
  } catch (err) {
    // console.error("JWT verification failed:", err);  //<-- add this
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;

