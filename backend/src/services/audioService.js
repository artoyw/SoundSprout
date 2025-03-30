const { spawn } = require('child_process');
const path = require('path');
const audioUtils = require('./audioUtils');
const Song = require('../models/Song');

class AudioService {
  constructor() {
    this.activeSessions = new Map();
    this.audioBuffer = new Map(); // Store audio data for processing
    this.bufferSize = 2048; // Size of audio buffer for processing
  }

  // Start a new audio session for a user
  async startSession(socketId, songId) {
    if (this.activeSessions.has(socketId)) {
      return { error: 'Session already exists' };
    }

    // Get song data from database
    const song = await Song.findById(songId);
    if (!song) {
      return { error: 'Song not found' };
    }

    const session = {
      songId,
      startTime: Date.now(),
      notes: [],
      score: 0,
      isActive: true,
      song: song,
      lastNoteTime: Date.now(),
      currentNote: null
    };

    this.activeSessions.set(socketId, session);
    this.audioBuffer.set(socketId, []);
    return session;
  }

  // Process incoming audio data
  processAudioData(socketId, audioData) {
    const session = this.activeSessions.get(socketId);
    if (!session) {
      return { error: 'No active session found' };
    }

    // Add new audio data to buffer
    const buffer = this.audioBuffer.get(socketId);
    buffer.push(...audioData);

    // Process buffer if it's full enough
    if (buffer.length >= this.bufferSize) {
      const frequency = audioUtils.detectFrequency(buffer.slice(0, this.bufferSize));
      const detectedNote = audioUtils.frequencyToNote(frequency);
      
      if (detectedNote) {
        const currentTime = Date.now();
        const timeSinceLastNote = currentTime - session.lastNoteTime;

        // Only record new note if enough time has passed (to avoid duplicate notes)
        if (timeSinceLastNote > 100) { // Minimum 100ms between notes
          session.lastNoteTime = currentTime;
          session.currentNote = {
            note: detectedNote,
            timestamp: currentTime - session.startTime,
            duration: timeSinceLastNote
          };
        }
      }

      // Remove processed data from buffer
      buffer.splice(0, this.bufferSize);
    }

    return { 
      success: true, 
      note: session.currentNote?.note,
      timestamp: session.currentNote?.timestamp
    };
  }

  // End a session and calculate score
  endSession(socketId) {
    const session = this.activeSessions.get(socketId);
    if (!session) {
      return { error: 'No active session found' };
    }

    session.isActive = false;
    const score = this.calculateScore(session);
    
    // Clean up
    this.activeSessions.delete(socketId);
    this.audioBuffer.delete(socketId);

    return {
      success: true,
      score,
      notes: session.notes,
      details: {
        pitchScore: score.pitchScore,
        rhythmScore: score.rhythmScore,
        overallScore: score.overallScore
      }
    };
  }

  // Calculate score based on note accuracy
  calculateScore(session) {
    const expectedNotes = session.song.noteData;
    const playedNotes = session.notes;
    const tempo = session.song.tempo;

    const pitchScore = audioUtils.calculatePitchScore(expectedNotes, playedNotes);
    const rhythmScore = audioUtils.calculateRhythmScore(expectedNotes, playedNotes, tempo);
    const overallScore = audioUtils.calculateOverallScore(expectedNotes, playedNotes, tempo);

    return {
      pitchScore,
      rhythmScore,
      overallScore
    };
  }
}

module.exports = new AudioService(); 