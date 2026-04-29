const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

router.get('/:tournamentId/messages', auth(), async (req, res) => {
  try {
    const messages = await Message.find({ tournamentId: req.params.tournamentId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
