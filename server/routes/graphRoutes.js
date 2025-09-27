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

// Increment problemsSolved for a graph track
router.patch('/:id/increment', authMiddleware, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const { id } = req.params;
		const doc = await GraphTrack.findOne({ _id: id, user: userId });
		if (!doc) return res.status(404).json({ message: 'Not found' });

		doc.problemsSolved = (doc.problemsSolved || 0) + 1;
		doc.lastModified = new Date();
		await doc.save();

		res.json(doc);
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

		doc.problemsSolved = Math.max(0, (doc.problemsSolved || 0) - 1);
		doc.lastModified = new Date();
		await doc.save();

		res.json(doc);
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
