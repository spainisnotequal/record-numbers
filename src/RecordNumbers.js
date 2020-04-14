import React, { useState, useEffect, useRef } from "react";

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

  let mediaRecorder = useRef(null);
  let mediaChuncks = useRef([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => (mediaRecorder.current = new MediaRecorder(stream)))
      .catch((err) => {
        console.log("The following getUserMedia error occured: " + err);
      });
  }, []);

  const startRecording = () => {
    mediaRecorder.current.start();
    console.log("recording");
    mediaRecorder.current.ondataavailable = ({ data }) =>
      mediaChuncks.current.push(data);
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
    }
  };
  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      console.log("stopping");
      mediaRecorder.current.stop();

      const blobProperty = { type: "audio/wav" };
      const blob = new Blob(mediaChuncks.current, blobProperty);
      const url = URL.createObjectURL(blob);
      console.log("stopped");
      console.log(url);
    }
  };

  const toggle = () => {
    // Start the timer
    setIsActive(!isActive);
    startRecording();
  };

  const reset = () => {
    // Stop the timer and go to the first element
    setIsActive(false);
    setIndex(0);
    stopRecording();
  };

  const stop = () => {
    // Stop the timer and go to the last element
    setIsActive(false);
    setIndex(array.length - 1);
    stopRecording();
  };

  return (
    <>
      <h2>{array[index]}</h2>
      <br />
      <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
      <button onClick={reset}>Reset</button>
      <button onClick={stop}>Stop</button>
    </>
  );
};

export default RecordNumbers;
