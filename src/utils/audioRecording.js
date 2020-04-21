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

const stopRecording = (mediaRecorder, mediaChuncks) => {
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

export { getMediaStream, startRecording, stopRecording };
