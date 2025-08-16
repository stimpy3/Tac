// routes/deadlineRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const Deadline = require("../models/Deadline.js");

const router = express.Router();

// Create deadline
router.post("/", authMiddleware, async (req, res) => {
    try{
      const deadline = new Deadline({ ...req.body, user: req.user.id });//user is a field in Deadline schema
      // req.body should contain { name, date, category, details }
      // user is automatically set to the logged-in user's ID
      await deadline.save();//await deadline.save() → writes to MongoDB.
      res.json(deadline);//sends the saved document (with _id and timestamps) back to frontend.
    }
    catch (error) { //good to undertand what went wrong
       console.error("Deadline creation failed:", err); 
       res.status(500).json({ message: "Failed to create deadline", error: err.message });
       //err.message gives a more specific error message
    }
});

// Get all deadlines for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const deadlines = await Deadline.find({ userId: req.user.id });
  res.json(deadlines);
});

// Delete a deadline
router.delete("/:id", authMiddleware, async (req, res) => {
  await Deadline.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
