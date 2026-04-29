const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  date: { type: Date, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  maxParticipants: { type: Number, default: 16 },
  bracketType: { type: String, enum: ['Single Elimination', 'Double Elimination', 'Round Robin'], default: 'Single Elimination' },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
