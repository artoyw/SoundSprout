import React, { useEffect, useRef, useState } from 'react';

const NoteVisualizer = ({ currentNote, expectedNote, tempo }) => {
  const canvasRef = useRef(null);
  const [noteHistory, setNoteHistory] = useState([]);
  const animationFrame = useRef(null);

  useEffect(() => {
    if (currentNote) {
      setNoteHistory(prev => [...prev, currentNote].slice(-50)); // Keep last 50 notes
    }
  }, [currentNote]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw note history
      noteHistory.forEach((note, index) => {
        const x = (index / noteHistory.length) * canvas.width;
        const y = canvas.height / 2;
        
        // Draw note circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = note.note === expectedNote ? '#4CAF50' : '#f44336';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Draw note name
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(note.note, x, y - 20);
      });

      // Draw expected note line
      if (expectedNote) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#2196F3';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [noteHistory, expectedNote]);

  return (
    <div className="note-visualizer">
      <div className="note-display">
        <div className="current-note">
          <h3>Current Note</h3>
          <div className={`note ${currentNote?.note === expectedNote ? 'correct' : 'incorrect'}`}>
            {currentNote?.note || '--'}
          </div>
        </div>
        <div className="expected-note">
          <h3>Expected Note</h3>
          <div className="note">{expectedNote || '--'}</div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="note-canvas"
      />

      <style jsx>{`
        .note-visualizer {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          margin: 20px 0;
        }

        .note-display {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }

        .current-note, .expected-note {
          text-align: center;
        }

        .note {
          font-size: 48px;
          font-weight: bold;
          padding: 20px;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .note.correct {
          background: #E8F5E9;
          color: #4CAF50;
        }

        .note.incorrect {
          background: #FFEBEE;
          color: #f44336;
        }

        .note-canvas {
          width: 100%;
          height: 200px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        h3 {
          margin: 0 0 10px 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default NoteVisualizer; 