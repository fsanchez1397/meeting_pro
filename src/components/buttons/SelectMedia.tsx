import { useRef, useState } from "react";

function SelectMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const testing = async () => {
    const constraints = { audio: true, video: true };
    let chunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log(stream);
    } catch (err) {
      console.log(err);
    }
  };

  const playMedia = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: {
        width: 320,
        height: 240,
        frameRate: 30,
      },
    });

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const pauseMedia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  const saveVideo = () => {};

  return (
    <>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <button onClick={playMedia}>Record</button>
      <button onClick={testing}>Click me</button>
      <button onClick={pauseMedia}>Pause</button>
      <button onClick={saveVideo}>Save Video</button>
    </>
  );
}

export default SelectMedia;
