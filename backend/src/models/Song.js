const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
});

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  noteData: [noteSchema],
  tempo: {
    type: Number,
    required: true,
    default: 120
  },
  timeSignature: {
    type: String,
    required: true,
    default: '4/4'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', songSchema); 