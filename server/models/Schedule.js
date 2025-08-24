const mongoose = require("mongoose");
const scheduleSchema= new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    day:{ type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], required: true },
    startTime:{ type: String, required: true },
    endTime:{ type: String, required: true },
    name:{ type: String, required: true }
});

module.exports = mongoose.model('Schedule',scheduleSchema);