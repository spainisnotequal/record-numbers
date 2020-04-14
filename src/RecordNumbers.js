import React, { useState, useEffect } from "react";

const RecordNumbers = () => {
  // Hooks for the Timer
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    // Start the timer
    setIsActive(!isActive);
  };

  const stop = () => {
    // Reset the timer
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <>
      <h2>{seconds}</h2>
      <br />
      <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
      <button onClick={stop}>Stop</button>
    </>
  );
};

export default RecordNumbers;
