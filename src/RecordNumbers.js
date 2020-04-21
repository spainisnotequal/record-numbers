import React, { useState, useEffect, useRef } from "react";

import {
  getMediaStream,
  startRecording,
  resetRecording,
  pauseRecording,
  resumeRecording,
} from "./utils/audioRecording";

const RecordNumbers = () => {
  const IMAGE_CHANGE_INTERVAL = 1000;
  // Hooks for the Timer
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const array = ["one", "two", "three"];

  useEffect(() => {
    let interval = null;
    if (isActive && index < array.length - 1) {
      interval = setInterval(() => {
        setIndex((seconds) => seconds + 1);
      }, IMAGE_CHANGE_INTERVAL);
    } else if (index !== 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, index, array]);

  // Hooks for the Timer
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaChuncks = useRef([]);
  const [isPaused, setIsPaused] = useState(false);

  // Get media stream when loading the app
  useEffect(() => {
    getMediaStream()
      .then((stream) => {
        mediaStream.current = stream;
        console.log("mediaStream.current:", mediaStream.current);
      })
      .catch((err) => console.log(err));
  }, []);

  // Stop recording when reaching the last image
  useEffect(() => {
    if (isActive && index === array.length - 1) {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
        console.log(mediaRecorder.current.state);

        // Grab and finalize the recorded blob
        mediaRecorder.current.onstop = () => {
          const blob = new Blob(mediaChuncks.current, { type: "audio/wav" });
          console.log("Blob generated:", blob);
          mediaChuncks.current = [];
          const url = URL.createObjectURL(blob);
          console.log("Blob URL:", url);
        };
      }
    }
  }, [isActive, index, array]);

  const start = () => {
    setIsActive(!isActive);
    setIsPaused(false);
    startRecording(mediaStream, mediaRecorder, mediaChuncks);
  };

  const pause = () => {
    setIsActive(!isActive);
    setIsPaused(true);
    pauseRecording(mediaRecorder);
  };

  const resume = () => {
    setIsActive(!isActive);
    setIsPaused(false);
    resumeRecording(mediaRecorder);
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIndex(0);
    resetRecording(mediaRecorder, mediaChuncks);
  };

  return (
    <>
      <h2>{array[index]}</h2>
      <br />
      <button onClick={!isPaused ? (!isActive ? start : pause) : resume}>
        {!isPaused ? (!isActive ? "Start" : "Pause") : "Resume"}
      </button>
      <button onClick={reset}>Reset</button>
    </>
  );
};

export default RecordNumbers;
