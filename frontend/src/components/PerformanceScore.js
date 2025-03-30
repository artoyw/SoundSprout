import React from 'react';

const PerformanceScore = ({ score, notes }) => {
  if (!score) return null;

  return (
    <div className="performance-score">
      <h2>Performance Results</h2>
      
      <div className="score-grid">
        <div className="score-card overall">
          <h3>Overall Score</h3>
          <div className="score-value">{Math.round(score.overallScore)}%</div>
        </div>
        
        <div className="score-card pitch">
          <h3>Pitch Accuracy</h3>
          <div className="score-value">{Math.round(score.pitchScore)}%</div>
        </div>
        
        <div className="score-card rhythm">
          <h3>Rhythm Accuracy</h3>
          <div className="score-value">{Math.round(score.rhythmScore)}%</div>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Performance Feedback</h3>
        <div className="feedback-content">
          {generateFeedback(score)}
        </div>
      </div>

      <style jsx>{`
        .performance-score {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 20px 0;
        }

        .score-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .score-card {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          background: #f8f9fa;
        }

        .score-card.overall {
          background: #E3F2FD;
          grid-column: 1 / -1;
        }

        .score-card.pitch {
          background: #E8F5E9;
        }

        .score-card.rhythm {
          background: #FFF3E0;
        }

        .score-value {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
        }

        .feedback-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .feedback-content {
          margin-top: 15px;
          line-height: 1.6;
        }

        h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        h3 {
          margin: 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// Generate feedback based on scores
function generateFeedback(score) {
  const feedback = [];

  // Overall score feedback
  if (score.overallScore >= 90) {
    feedback.push("Excellent performance! You've mastered this piece!");
  } else if (score.overallScore >= 80) {
    feedback.push("Great job! Your performance shows strong understanding of the piece.");
  } else if (score.overallScore >= 70) {
    feedback.push("Good effort! Keep practicing to improve your performance.");
  } else {
    feedback.push("Keep practicing! Focus on the areas that need improvement.");
  }

  // Pitch accuracy feedback
  if (score.pitchScore < 80) {
    feedback.push("Work on your pitch accuracy. Try practicing with a tuner to improve intonation.");
  }

  // Rhythm accuracy feedback
  if (score.rhythmScore < 80) {
    feedback.push("Focus on your timing. Practice with a metronome to improve rhythm accuracy.");
  }

  return feedback.map((text, index) => (
    <p key={index}>{text}</p>
  ));
}

export default PerformanceScore; 