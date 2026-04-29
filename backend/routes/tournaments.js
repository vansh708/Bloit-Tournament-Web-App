const express = require('express');
const auth = require('../middleware/auth');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

const router = express.Router();

// Get all tournaments (with filtering)
router.get('/', async (req, res) => {
  try {
    const { game, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (game) filter.game = new RegExp(game, 'i');
    if (status) filter.status = status;

    const tournaments = await Tournament.find(filter)
      .populate('organizer', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Tournament.countDocuments(filter);

    res.json({ tournaments, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create tournament (Organizer only)
router.post('/', auth('Organizer'), async (req, res) => {
  try {
    const { title, game, date, maxParticipants, bracketType } = req.body;
    
    const tournament = new Tournament({
      title, game, date, maxParticipants, bracketType, organizer: req.user.id
    });
    
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join tournament (Player only)
router.post('/:id/join', auth('Player'), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    
    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    if (tournament.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined' });
    }

    tournament.participants.push(req.user.id);
    await tournament.save();

    res.json({ message: 'Joined successfully', tournament });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit tournament (Organizer only)
router.put('/:id', auth('Organizer'), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this tournament' });
    }

    Object.assign(tournament, req.body);
    await tournament.save();

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete tournament
router.delete('/:id', auth('Organizer'), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this tournament' });
    }

    await tournament.deleteOne();
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
