// routes/deadlineRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const Deadline = require("../models/Deadline.js");

const router = express.Router();

// Create deadline
router.post("/", authMiddleware, async (req, res) => {
  const deadline = new Deadline({ ...req.body, userId: req.user.id });
  await deadline.save();//await deadline.save() → writes to MongoDB.
  res.json(deadline);//sends the saved document (with _id and timestamps) back to frontend.
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
