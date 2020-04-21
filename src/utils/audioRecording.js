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

export { getMediaStream, startRecording };
