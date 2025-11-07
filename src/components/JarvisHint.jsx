// src/components/JarvisHint.jsx
import React, { useEffect, useState } from "react";
import './JarvisHint.css';

const JarvisHint = ({ text, onFinish, speed = 50, emote = "🤖" }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (index < text.length && !paused) {
      const timeout = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (index >= text.length) {
      onFinish();
    }
  }, [index, paused, text, speed, onFinish]);

  const togglePause = () => setPaused(prev => !prev);

  return (
    <div className="jarvis-hint p-3 mb-3" style={{background: "#222", borderRadius: "8px"}}>
      <div className="hint-text text-light">
        {emote} {displayed}
      </div>
      <div className="hint-controls mt-2">
        <button className="btn btn-sm btn-primary me-2" onClick={togglePause}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button className="btn btn-sm btn-secondary me-2" onClick={() => setIndex(text.length)}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default JarvisHint;
