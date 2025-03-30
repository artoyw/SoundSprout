import React, { useState } from 'react';
import AudioCapture from './AudioCapture';
import NoteVisualizer from './NoteVisualizer';
import PerformanceScore from './PerformanceScore';

const PracticeSession = ({ song }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [expectedNote, setExpectedNote] = useState(null);
  const [score, setScore] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleNoteDetected = (data) => {
    setCurrentNote(data);
    // Find the expected note based on the current timestamp
    const expectedNote = findExpectedNote(data.timestamp);
    setExpectedNote(expectedNote);
  };

  const handleSessionEnd = (data) => {
    setScore(data.details);
    setIsActive(false);
  };

  const findExpectedNote = (timestamp) => {
    if (!song.noteData) return null;
    
    // Find the note that should be played at this timestamp
    const note = song.noteData.find(note => 
      timestamp >= note.timestamp && 
      timestamp <= note.timestamp + note.duration
    );
    
    return note ? note.note : null;
  };

  return (
    <div className="practice-session">
      <h1>Practice: {song.title}</h1>
      <p className="song-info">
        {song.artist} • Tempo: {song.tempo} BPM • Time Signature: {song.timeSignature}
      </p>

      <AudioCapture
        songId={song._id}
        onNoteDetected={handleNoteDetected}
        onSessionEnd={handleSessionEnd}
      />

      {isActive && (
        <NoteVisualizer
          currentNote={currentNote}
          expectedNote={expectedNote}
          tempo={song.tempo}
        />
      )}

      {score && (
        <PerformanceScore
          score={score}
          notes={song.noteData}
        />
      )}

      <style jsx>{`
        .practice-session {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .song-info {
          color: #666;
          margin-bottom: 30px;
        }
      `}</style>
    </div>
  );
};

export default PracticeSession; 