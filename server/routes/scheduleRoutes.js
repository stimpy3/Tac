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
/*

findOneAndDelete(filter)
Finds one single document matching the filter.
Deletes it.
Returns the deleted document itself (so you can see what you just yeeted from the DB

deleteMany() doesn’t return the actual deleted documents — it returns a result object like:
{
  acknowledged: true,
  deletedCount: 3
}
 */
// Delete all schedules for a given day
router.delete("/:day", authMiddleware, async (req, res) => {
  try {
    const result = await Schedule.deleteMany({
      day: req.params.day,
      user: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No schedules found for this day" });
    }

    res.json({ message: `Deleted ${result.deletedCount} schedules successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
