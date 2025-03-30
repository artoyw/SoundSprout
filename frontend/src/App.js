import React from 'react';
import PracticeSession from './components/PracticeSession';
import './App.css';

// Sample song data for testing
const sampleSong = {
  _id: '1',
  title: 'Twinkle, Twinkle, Little Star',
  artist: 'Traditional',
  tempo: 120,
  timeSignature: '4/4',
  noteData: [
    { note: 'C4', timestamp: 0, duration: 500 },
    { note: 'C4', timestamp: 500, duration: 500 },
    { note: 'G4', timestamp: 1000, duration: 500 },
    { note: 'G4', timestamp: 1500, duration: 500 },
    { note: 'A4', timestamp: 2000, duration: 500 },
    { note: 'A4', timestamp: 2500, duration: 500 },
    { note: 'G4', timestamp: 3000, duration: 1000 },
  ]
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SoundSprout</h1>
        <p>Your Musical Learning Companion</p>
      </header>
      <main>
        <PracticeSession song={sampleSong} />
      </main>
    </div>
  );
}

export default App;
