const getMediaStream = () => {
  console.log("Acquiring media");
  return navigator.mediaDevices.getUserMedia({ audio: true });
};

const startRecording = (mediaStream, mediaRecorder, mediaChuncks) => {
  if (mediaStream.current) {
    mediaRecorder.current = new MediaRecorder(mediaStream.current);
    mediaRecorder.current.start();
    console.log(mediaRecorder.current.state);
    mediaRecorder.current.ondataavailable = ({ data }) =>
      mediaChuncks.current.push(data);
  }
};

const resetRecording = (mediaRecorder, mediaChuncks) => {
  if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = (event) => {
      mediaChuncks.current = [];
    };
    console.log(mediaRecorder.current.state);
  }
};

const pauseRecording = (mediaRecorder) => {
  if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
    mediaRecorder.current.pause();
    console.log(mediaRecorder.current.state);
  }
};

const resumeRecording = (mediaRecorder) => {
  if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
    mediaRecorder.current.resume();
    console.log(mediaRecorder.current.state);
  }
};

export {
  getMediaStream,
  startRecording,
  resetRecording,
  pauseRecording,
  resumeRecording,
};
