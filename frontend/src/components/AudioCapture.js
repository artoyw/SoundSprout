import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const AudioCapture = ({ songId, onNoteDetected, onSessionEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const audioContext = useRef(null);
  const mediaStream = useRef(null);
  const analyser = useRef(null);
  const socket = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socket.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
    
    // Set up socket event listeners
    socket.current.on('noteDetected', (data) => {
      if (data.note) {
        onNoteDetected(data);
      }
    });

    socket.current.on('sessionEnded', (data) => {
      onSessionEnd(data);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      stopRecording();
    };
  }, [songId, onNoteDetected, onSessionEnd]);

  const startRecording = async () => {
    try {
      // Request microphone access
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context and analyser
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      
      const source = audioContext.current.createMediaStreamSource(mediaStream.current);
      source.connect(analyser.current);
      
      // Start the session on the server
      socket.current.emit('startPractice', songId);
      
      // Start processing audio data
      processAudioData();
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setIsRecording(false);
    
    // End the session on the server
    if (socket.current) {
      socket.current.emit('endPractice');
    }
  };

  const processAudioData = () => {
    if (!analyser.current) return;

    const dataArray = new Float32Array(analyser.current.frequencyBinCount);
    analyser.current.getFloatTimeDomainData(dataArray);

    // Send audio data to server
    socket.current.emit('audioData', Array.from(dataArray));

    // Request next frame
    animationFrame.current = requestAnimationFrame(processAudioData);
  };

  return (
    <div className="audio-capture">
      <div className="controls">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <style jsx>{`
        .audio-capture {
          padding: 20px;
          text-align: center;
        }
        
        .controls {
          margin-bottom: 20px;
        }
        
        .record-button {
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 25px;
          border: none;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .record-button.recording {
          background-color: #f44336;
          animation: pulse 1.5s infinite;
        }
        
        .error-message {
          color: #f44336;
          margin-top: 10px;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AudioCapture; 