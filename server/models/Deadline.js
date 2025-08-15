// models/Deadline.js
const mongoose = require('mongoose');

const DeadlineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true, required: true },
    name: { type: String, required: true, maxlength: 50 }, // your UI shows 13 chars; backend allows up to 50
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ['academic', 'health', 'career', 'personal', 'other'],
      default: 'other',
    },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

// sort helper index (frequent query: user's deadlines ordered by date)
DeadlineSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Deadline', DeadlineSchema);
