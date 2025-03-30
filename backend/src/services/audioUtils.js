// Musical note frequencies (in Hz)
const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88
};

// Tolerance for note detection (in cents, 100 cents = 1 semitone)
const NOTE_TOLERANCE = 50;

// Convert frequency to note name
function frequencyToNote(frequency) {
  if (!frequency || frequency <= 0) return null;

  // Calculate the note number (MIDI note number)
  const noteNumber = 12 * Math.log2(frequency / 440) + 69;
  
  // Convert to note name
  const octave = Math.floor(noteNumber / 12) - 1;
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteName = noteNames[Math.round(noteNumber) % 12];
  
  return `${noteName}${octave}`;
}

// Calculate cents difference between two frequencies
function centsDifference(freq1, freq2) {
  return 1200 * Math.log2(freq1 / freq2);
}

// Detect the most prominent frequency in audio data
function detectFrequency(audioData) {
  // Simple peak detection for now
  // In a real implementation, this would use FFT
  let maxAmplitude = 0;
  let dominantFrequency = 0;

  for (let i = 0; i < audioData.length; i++) {
    if (Math.abs(audioData[i]) > maxAmplitude) {
      maxAmplitude = Math.abs(audioData[i]);
      dominantFrequency = i * (44100 / audioData.length); // Assuming 44.1kHz sample rate
    }
  }

  return dominantFrequency;
}

// Calculate rhythm accuracy score
function calculateRhythmScore(expectedNotes, playedNotes, tempo) {
  let totalScore = 0;
  const beatDuration = 60000 / tempo; // Duration of one beat in milliseconds

  for (let i = 0; i < Math.min(expectedNotes.length, playedNotes.length); i++) {
    const expectedNote = expectedNotes[i];
    const playedNote = playedNotes[i];
    
    // Calculate timing difference in beats
    const timingDiff = Math.abs(playedNote.timestamp - expectedNote.timestamp) / beatDuration;
    
    // Calculate duration difference in beats
    const durationDiff = Math.abs(playedNote.duration - expectedNote.duration) / beatDuration;
    
    // Score based on timing and duration accuracy
    const timingScore = Math.max(0, 1 - timingDiff);
    const durationScore = Math.max(0, 1 - durationDiff);
    
    totalScore += (timingScore + durationScore) / 2;
  }

  return (totalScore / expectedNotes.length) * 100;
}

// Calculate pitch accuracy score
function calculatePitchScore(expectedNotes, playedNotes) {
  let totalScore = 0;

  for (let i = 0; i < Math.min(expectedNotes.length, playedNotes.length); i++) {
    const expectedNote = expectedNotes[i];
    const playedNote = playedNotes[i];
    
    if (expectedNote.note === playedNote.note) {
      totalScore += 1;
    }
  }

  return (totalScore / expectedNotes.length) * 100;
}

// Calculate overall performance score
function calculateOverallScore(expectedNotes, playedNotes, tempo) {
  const pitchScore = calculatePitchScore(expectedNotes, playedNotes);
  const rhythmScore = calculateRhythmScore(expectedNotes, playedNotes, tempo);
  
  // Weight the scores (can be adjusted)
  const PITCH_WEIGHT = 0.6;
  const RHYTHM_WEIGHT = 0.4;
  
  return (pitchScore * PITCH_WEIGHT) + (rhythmScore * RHYTHM_WEIGHT);
}

module.exports = {
  frequencyToNote,
  detectFrequency,
  calculateOverallScore,
  calculatePitchScore,
  calculateRhythmScore
}; 