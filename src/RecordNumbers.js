import React, { useState, useEffect, useRef } from "react";

const RecordNumbers = () => {
  // Hooks for the Timer
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const array = ["zero", "one", "two", "three", "four", "five"];

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaChuncks = useRef([]);
  const [status, setStatus] = useState("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [error, setError] = useState("NONE");

  const getMediaStream = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaStream.current = stream;
      })
      .catch((err) => {
        console.log("The following getUserMedia error occured: " + err);
      });
  };

  useEffect(() => {
    getMediaStream();
  }, []);

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

  const startRecording = async () => {
    setError("NONE");
    if (!mediaStream.current) {
      await getMediaStream();
    }
    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.onerror = () => {
        setError("NO_RECORDER");
        console.log(error);
        setStatus("idle");
        console.log(status);
      };
      mediaRecorder.current.start();
      setStatus("recording");
      console.log(status);
    }
  };

  const onRecordingActive = ({ data }) => {
    mediaChuncks.current.push(data);
  };

  const onRecordingStop = () => {
    const blobProperty = { type: "audio/wav" };
    const blob = new Blob(mediaChuncks.current, blobProperty);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    console.log(status);
    setMediaBlobUrl(url);
    console.log(mediaBlobUrl);
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
      setStatus("stopping");
      console.log(status);
      mediaRecorder.current.stop();
    }
  };

  const toggle = () => {
    // Start the timer
    setIsActive(!isActive);
  };

  const reset = () => {
    // Stop the timer and go to the first element
    setIsActive(false);
    setIndex(0);
  };

  const stop = () => {
    // Stop the timer and go to the last element
    setIsActive(false);
    setIndex(array.length - 1);
  };

  return (
    <>
      <h2>{array[index]}</h2>
      <br />
      <button onClick={toggle} disabled={isActive ? true : false}>
        {isActive ? "Pause" : "Start"}
      </button>
      <button onClick={reset} disabled={isActive ? false : true}>
        Reset
      </button>
      <button onClick={stop} disabled={isActive ? false : true}>
        Stop
      </button>
      <br />
      <br />
      <button onClick={startRecording}>Start recording</button>
      <button onClick={pauseRecording}>Pause recording</button>
      <button onClick={resumeRecording}>Resume recording</button>
      <button onClick={stopRecording}>Stop recording</button>
    </>
  );
};

export default RecordNumbers;
