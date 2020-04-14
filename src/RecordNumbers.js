import React, { useState, useEffect } from "react";

const RecordNumbers = () => {
  // Hooks for the Timer
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const array = ["zero", "one", "two", "three", "four", "five"];

  useEffect(() => {
    let interval = null;
    if (isActive && index < array.length - 1) {
      interval = setInterval(() => {
        setIndex((seconds) => seconds + 1);
      }, 1000);
    } else if (index !== 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, index, array]);

  const toggle = () => {
    // Start the timer
    setIsActive(!isActive);
  };

  const stop = () => {
    // Reset the timer
    setIndex(0);
    setIsActive(false);
  };

  return (
    <>
      <h2>{array[index]}</h2>
      <br />
      <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
      <button onClick={stop}>Stop</button>
    </>
  );
};

export default RecordNumbers;
