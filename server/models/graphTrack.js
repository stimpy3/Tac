const mongoose = require('mongoose');

const GraphTrackSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true, required: true },
		name: { type: String, required: true, maxlength: 100 },
		description: { type: String, default: '' },
		startDate: { type: Date, required: true },
		frequency: { type: Number, required: true },
		// store counts per day as YYYY-MM-DD -> number
		dailyCounts: {
			type: Map,
			of: Number,
			default: {},
		},
		// total across all days (kept in sync)
		problemsSolved: { type: Number, default: 0 },
		category: {
			type: String,
			enum: ['academic', 'health', 'career', 'personal', 'other'],
			default: 'other',
		},
		icon: { type: String, default: '' },
		color: { type: String, default: '' },
	},
	{ timestamps: true }
);

GraphTrackSchema.index({ user: 1, startDate: 1 });

module.exports = mongoose.model('GraphTrack', GraphTrackSchema);

