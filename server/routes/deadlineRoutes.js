// routes/deadlineRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const Deadline = require("../models/Deadline.js");

const router = express.Router();

// Create deadline
router.post("/", authMiddleware, async (req, res) => {
    console.log("req.user:", req.user); // <-- add this
    console.log("req.body:", req.body); // <-- add this
    try{
      const deadline = new Deadline({ ...req.body, user: req.user.userId });//user is a field in Deadline schema
      //userId is defined in my JWT payload (see index.js)
      /*in index.js you will find:
       const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
          ); */
      // req.body should contain { name, date, category, details }
      // user is automatically set to the logged-in user's ID
      await deadline.save();//await deadline.save() → writes to MongoDB.
      res.json(deadline);//sends the saved document (with _id and timestamps) back to frontend.
    }
    catch (err) { //good to undertand what went wrong
       console.error("Deadline creation failed:", err); 
       res.status(500).json({ message: "Failed to create deadline", error: err.message });
       //err.message gives a more specific error message
    }
});

// Get all deadlines for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const deadlines = await Deadline.find({ user: req.user.userId });
  res.json(deadlines);
});

// Delete a deadline
router.delete("/:id", authMiddleware, async (req, res) => {
  await Deadline.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
