import React, { useState, useEffect, useRef } from "react";

const RecordNumbers = () => {
  const IMAGE_CHANGE_INTERVAL = 2000;
  // Hooks for the Timer
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const bicycle = require("./images/bicycle.jpg");
  const car = require("./images/car.jpg");
  const dog = require("./images/dog.jpg");
  const horse = require("./images/horse.jpg");

  const array = [bicycle, car, dog, horse];

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

  const getMediaStream = () => {
    console.log("Acquiring media");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => (mediaStream.current = stream))
      .catch((err) => {
        console.log("The following getUserMedia error occured: " + err);
      });
  };

  // Get media stream when loading the app
  useEffect(() => {
    getMediaStream();
  }, []);

  // Stop recording when reaching the last image
  useEffect(() => {
    if (isActive && index === array.length - 1) stopRecording();
  }, [isActive, index, array]);

  const startRecording = () => {
    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.start();
      console.log(mediaRecorder.current.state);
      mediaRecorder.current.ondataavailable = ({ data }) =>
        mediaChuncks.current.push(data);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
      console.log(mediaRecorder.current.state);
    }
  };
  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
      console.log(mediaRecorder.current.state);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      console.log(mediaRecorder.current.state);

      const blobProperty = { type: "audio/wav" };
      const blob = new Blob(mediaChuncks.current, blobProperty);
      const url = URL.createObjectURL(blob);
      console.log("Bolb generated...");
      console.log(url);
    }
  };

  const resetRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      console.log(mediaRecorder.current.state);
    }
  };

  const start = () => {
    setIsActive(!isActive);
    setIsPaused(false);
    startRecording();
  };

  const pause = () => {
    setIsActive(!isActive);
    setIsPaused(true);
    pauseRecording();
  };

  const resume = () => {
    setIsActive(!isActive);
    setIsPaused(false);
    resumeRecording();
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIndex(0);
    resetRecording();
  };

  const stop = () => {
    setIsActive(false);
    setIsPaused(false);
    setIndex(array.length - 1);
    stopRecording();
  };

  return (
    <>
      <h2>
        <img
          src={array[index]}
          alt=""
          style={{
            height: "128px",
            width: "128px",
          }}
        />
      </h2>
      <br />
      <button onClick={!isPaused ? (!isActive ? start : pause) : resume}>
        {!isPaused ? (!isActive ? "Start" : "Pause") : "Resume"}
      </button>
      <button onClick={reset}>Reset</button>
      <button onClick={stop}>Stop</button>
    </>
  );
};

export default RecordNumbers;
