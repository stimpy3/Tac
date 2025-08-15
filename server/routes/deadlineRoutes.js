// routes/deadlineRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Deadline from "../models/deadlineModel.js";

const router = express.Router();

// Create deadline
router.post("/", authMiddleware, async (req, res) => {
  const deadline = new Deadline({ ...req.body, userId: req.user.id });
  await deadline.save();
  res.json(deadline);
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

export default router;
