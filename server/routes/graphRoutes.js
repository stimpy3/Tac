const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const GraphTrack = require('../models/graphTrack');

// Create a new graph track (protected)
router.post('/', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const { name, description = '', startDate, frequency, category = 'other', icon = '', color = '' } = req.body;

		if (!name || !startDate || !frequency) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const start = new Date(startDate);

		const doc = await GraphTrack.create({
			user: userId,
			name,
			description,
			startDate: start,
			frequency,
			category,
			icon,
			color,
		});

		res.status(201).json(doc);
	} catch (err) {
		console.error('Failed to create graph track:', err);
		res.status(500).json({ message: 'Failed to create graph track', error: err.message });
	}
});

// Get all graph tracks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const docs = await GraphTrack.find({ user: userId }).sort({ createdAt: -1 });
		res.json(docs);
	} catch (err) {
		console.error('Failed to fetch graph tracks:', err);
		res.status(500).json({ message: 'Failed to fetch graph tracks', error: err.message });
	}
});

// Increment problemsSolved for a graph track
router.patch('/:id/increment', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const { id } = req.params;
		const doc = await GraphTrack.findOne({ _id: id, user: userId });
		if (!doc) return res.status(404).json({ message: 'Not found' });

		// compute elapsed days from startDate
		const start = new Date(doc.startDate);
		start.setHours(0,0,0,0);
		const today = new Date();
		today.setHours(0,0,0,0);
		const diffDays = Math.floor((today - start) / (1000*60*60*24)) + 1; // day 1..N
		if (diffDays > 30) return res.status(400).json({ message: 'Tracking period ended' });

		const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD

		// Atomic increment on the dailyCounts map and the problemsSolved total
		const update = {
			$inc: {
				[`dailyCounts.${todayKey}`]: 1,
				problemsSolved: 1,
			},
			$set: { lastModified: new Date() }
		};

		const updated = await GraphTrack.findOneAndUpdate({ _id: id, user: userId }, update, { new: true });
		res.json(updated);
	} catch (err) {
		console.error('Increment failed:', err);
		res.status(500).json({ message: 'Increment failed', error: err.message });
	}
});

// Decrement problemsSolved for a graph track (not below 0)
router.patch('/:id/decrement', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const { id } = req.params;
		const doc = await GraphTrack.findOne({ _id: id, user: userId });
		if (!doc) return res.status(404).json({ message: 'Not found' });

		// compute elapsed days from startDate
		const start = new Date(doc.startDate);
		start.setHours(0,0,0,0);
		const today = new Date();
		today.setHours(0,0,0,0);
		const diffDays = Math.floor((today - start) / (1000*60*60*24)) + 1; // day 1..N
		if (diffDays > 30) return res.status(400).json({ message: 'Tracking period ended' });

		const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD

		// Only decrement if today's count > 0 and problemsSolved > 0
		const todaysCount = doc.dailyCounts?.get ? doc.dailyCounts.get(todayKey) || 0 : (doc.dailyCounts && doc.dailyCounts[todayKey]) || 0;
		if (todaysCount <= 0) {
			return res.status(400).json({ message: 'Nothing to decrement today' });
		}

		const update = {
			$inc: {
				[`dailyCounts.${todayKey}`]: -1,
				problemsSolved: -1,
			},
			$set: { lastModified: new Date() }
		};

		const updated = await GraphTrack.findOneAndUpdate({ _id: id, user: userId }, update, { new: true });
		res.json(updated);
	} catch (err) {
		console.error('Decrement failed:', err);
		res.status(500).json({ message: 'Decrement failed', error: err.message });
	}
});

// Delete a graph track
router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const { id } = req.params;
		const doc = await GraphTrack.findOneAndDelete({ _id: id, user: userId });
		if (!doc) return res.status(404).json({ message: 'Not found' });

		res.json({ message: 'Deleted', id: doc._id });
	} catch (err) {
		console.error('Delete failed:', err);
		res.status(500).json({ message: 'Delete failed', error: err.message });
	}
});

module.exports = router;
