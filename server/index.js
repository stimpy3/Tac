require("dotenv").config(); // ✅ keep this at the very top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.js");
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
//must be written before routes because it needs to be applied to all incoming requests
/*
What’s happening
Your frontend lives here → https://stay-tac.netlify.app
Your backend lives here → https://tac-8pbr.onrender.com

Because they’re different domains, the browser asks your backend:
“Hey backend, is it okay if this frontend talks to you?”
Your backend needs to reply with a special header:
Access-Control-Allow-Origin: https://stay-tac.netlify.app

If the backend doesn’t send that, the browser blocks the request = CORS error.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://stay-tac.netlify.app",
];

//this section allows your backend to accept requests from specific origins
//This is important because browsers enforce CORS to prevent malicious sites from accessing your backend
//So you need to tell your backend which sites are allowed to make requests
//This is done using the cors middleware
//syntax goes like this:
//app.use(cors({ origin: "https://your-frontend.com" }));
//This allows requests from https://your-frontend.com to your backend
//You can also allow multiple origins by passing an array of allowed origins
//app.use(cors({ origin: ["https://your-frontend.com", "https://another-site.com"] }));
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

// after your app.use(cors(...))
app.options("/*\w", cors()); 
// This allows preflight requests to pass through
// Preflight requests are sent by the browser to check if the actual request is safe to send
// It’s like saying “yes, you can talk to me” for all routes
/*
Key takeaway (for beginners)
Simple GET requests → browser just delivers.
POST/DELETE with JSON or Authorization → browser knocks first (OPTIONS request).
app.options("*", cors()) → backend answers the knock so browser feels safe and lets the real request through.

If the backend doesn’t respond to the knock (OPTIONS), the security guard (browser) refuses to send the real package.
You might already allow http://localhost:5173 in CORS settings, but the preflight OPTIONS request needs its own answer.
Without it, the browser blocks the request — your POST never even reaches your backend.

CORS Access-Control-Allow-Origin is like saying:

“I trust this origin, it’s allowed to talk to me.”

So allowing the origin only answers the question: “Is this frontend allowed to talk to me at all?”
// But it doesn’t say what actions the frontend can do.
// That’s what the next part does.
*/
/*CORS Access-Control-Allow-Methods is like saying:
“Not only are you allowed to come in (origin), you are allowed to do these specific actions (GET, POST, DELETE).”
This is important because it tells the browser which HTTP methods are allowed for that origin.
// If you don’t specify this, the browser might block requests that use methods other than GET or POST.
// So you need to tell the browser which methods are allowed for that origin.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
Request type = what kind of action the frontend is trying to do
Examples: GET, POST, PUT, DELETE
Also includes headers like Content-Type: application/json or Authorization: Bearer token
CORS Access-Control-Allow-Methods is like saying:
“Not only are you allowed to come in (origin), you are allowed to do these specific actions (GET, POST, DELETE).”
 */

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
//-----------------Deadline Routes-----------------
// Mount the router here
const deadlineRoutes = require("./routes/deadlineRoutes.js");
app.use("/deadlines", deadlineRoutes);
// Now:
// POST   /api/deadlines
// GET    /api/deadlines
// DELETE /api/deadlines/:id
//-------------------------------------------------

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