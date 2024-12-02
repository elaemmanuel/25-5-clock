import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timingType, setTimingType] = useState('SESSION');
  const [isPlaying, setIsPlaying] = useState(false);

  const timerIdRef = useRef(null);
  const audioRef = useRef(null);

  const handleBreakIncrease = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (timingType === 'BREAK') {
        setTimeLeft((breakLength + 1) * 60);
      }
    }
  };

  const handleBreakDecrease = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (timingType === 'BREAK') {
        setTimeLeft((breakLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrease = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (timingType === 'SESSION') {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleSessionDecrease = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (timingType === 'SESSION') {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleReset = () => {
    clearInterval(timerIdRef.current);
    setIsPlaying(false);
    setTimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingType('SESSION');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    if (!timeLeft && timingType === 'SESSION') {
      setTimeLeft(breakLength * 60);
      setTimingType('BREAK');
      audioRef.current.play();
    } else if (!timeLeft && timingType === 'BREAK') {
      setTimeLeft(sessionLength * 60);
      setTimingType('SESSION');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (timeLeft === 0) {
          resetTimer();
        }
      }, 1000);
    } else {
      clearInterval(timerIdRef.current);
    }
    return () => clearInterval(timerIdRef.current);
  }, [isPlaying, timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const title = timingType === 'SESSION' ? 'Session' : 'Break';

  return (
    <div>
      <div className="wrapper">
        <h2>25 + 5 Clock</h2>
        <div className="break-session-length">
          <div className='pad'>
            <h3 id="break-label">Break Length</h3>
            <div>
              <button disabled={isPlaying} onClick={handleBreakIncrease} id="break-increment">
                +
              </button>
              <strong id="break-length">{breakLength}</strong>
              <button disabled={isPlaying} onClick={handleBreakDecrease} id="break-decrement">
                -
              </button>
            </div>
          </div>
          <div>
            <h3 id="session-label">Session Length</h3>
            <div>
              <button disabled={isPlaying} onClick={handleSessionIncrease} id="session-increment">
                +
              </button>
              <strong id="session-length">{sessionLength}</strong>
              <button disabled={isPlaying} onClick={handleSessionDecrease} id="session-decrement">
                -
              </button>
            </div>
          </div>
        </div>
        <div className="timer-wrapper">
          <div className="timer">
            <h2 id="timer-label">{title}</h2>
            <h3 id="time-left">{formatTime(timeLeft)}</h3>
          </div>
          <button onClick={handlePlayPause} id="start_stop" style={{backgroundColor: "green"}}>
            {isPlaying ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset} id="reset" style={{backgroundColor: "red"}}>Reset</button>
        </div>
      </div>
      <audio id="beep" ref={audioRef} preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
}

export default App;