const express = require('express');
const auth = require('../middleware/auth');
const Team = require('../models/Team');

const router = express.Router();

// Create team
router.post('/', auth(), async (req, res) => {
  try {
    const { name, game } = req.body;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const team = new Team({
      name, game, leader: req.user.id, members: [req.user.id], inviteCode
    });
    
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join team via invite code
router.post('/join', auth(), async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const team = await Team.findOne({ inviteCode });
    if (!team) return res.status(404).json({ message: 'Invalid invite code' });
    
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already in team' });
    }

    team.members.push(req.user.id);
    await team.save();

    res.json({ message: 'Joined team successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
