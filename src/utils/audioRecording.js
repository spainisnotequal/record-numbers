const getMediaStream = () => {
  console.log("Acquiring media");
  return navigator.mediaDevices.getUserMedia({ audio: true });
};

export { getMediaStream };
