// routes/deadlineRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const Schedule = require("../models/Schedule.js");

const router = express.Router();
/*express.Router() creates a mini Express application that can handle routes and middleware.
It doesn’t listen on a port by itself. Instead, it is like a sub-application that you attach
to the main Express app. */
/*Routers help you organize your code. Instead of writing all your
routes inside app.js or server.js, you can separate them into modules. */

// Get all schedules for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new schedule
router.post("/", authMiddleware, async (req, res) => {
  try {
    //Doing new Schedule() is like constructing a new “document object” that follows the schema.
    const newSchedule = new Schedule({
        user: req.user.id,
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        name: req.body.name
    });
    await newSchedule.save();
    res.json(newSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
So if err.message = "Database connection failed",
the response JSON becomes:
{
  "error": "Database connection failed"
}
In short:
{ error: err.message } is simply creating an object with a property called error.
  It’s a way to send error details back to the client in JSON format.
 */

// Delete a schedule
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
