require("dotenv").config(); // ✅ keep this at the very top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not set in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://stay-tac.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Routes ----------------
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Create a JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ error: "No such user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Incorrect password" });

  const token = jwt.sign(
    { userId: user._id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

app.post("/google-login", async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        username: name,
        email,
        picture,
        password: "",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});

app.post("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      message: "Token is valid",
      user: {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      },
    });
  } catch (err) {
    res.status(403).json({ message: "Token is invalid or expired" });
  }
});

// ---------------- Server ----------------
// app.listen(3001, () => {
//   console.log("🚀 Server running on port 3001");
// });

/*When you deploy to Render (or most cloud hosts), they don’t just let you pick any port like 3001.
Instead, they give you a port number via an environment variable called PORT that your app needs to use.
process.env.PORT grabs that port number Render assigns.
If process.env.PORT isn’t set (like when you run locally), it falls back to 3001.
If you hardcode app.listen(3001), Render might get mad because it expects you to listen on their
assigned port, not a fixed one. That can cause deployment to fail or your app not working properly.*/

//process.env.PORT is a special environment variable that stores the port number your app should listen on
//usually set by the hosting service (like Render, Heroku, Vercel, etc).
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});