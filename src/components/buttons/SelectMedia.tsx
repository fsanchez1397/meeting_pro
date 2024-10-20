import { useRef, useState } from "react";

function SelectMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoURL, setVideoURL] = useState<string | undefined>(undefined);
  const [downloadText, setDownloadText] = useState<string>(
    "No Video to Download"
  );
  let audioStream: MediaStream,
    videoStream: MediaStream,
    mixedStream: MediaStream,
    chunks: Blob[] = [];

  const constraintsVideo = {
    video: {
      width: 320,
      height: 240,
      frameRate: 30,
    },
  };
  const constraintsAudio = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  };

  const handleDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };
  //Gets Audio and Video data. Called inside StartRecording.
  const setupStream = async () => {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio);
      videoStream = await navigator.mediaDevices.getDisplayMedia(
        constraintsVideo
      );
    } catch (err) {
      console.log(err);
    }
  };
  //Handles recording of Video and Audio
  const startRecording = async () => {
    try {
      //Get streams
      await setupStream();
      //Verify streams
      if (videoStream && audioStream) {
        mixedStream = new MediaStream([
          ...videoStream.getTracks(),
          ...audioStream.getTracks(),
        ]);
      }
      //Create recorder
      const recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(200);
    } catch (err) {
      console.log(err);
    }
  };
  //Handles the end of recording
  const handleStop = () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    setVideoURL(URL.createObjectURL(blob));

    videoStream.getTracks().forEach((track) => track.stop());
    audioStream.getTracks().forEach((track) => track.stop());

    console.log("Recording stopped");
  };
  //Plays and records Video and Audio
  const playMedia = async () => {
    await startRecording();
    //check for video element and stream
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    } else {
      console.log("No video element or stream");
    }
  };
  const pauseMedia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const isDownloadReady = videoURL ? true : false;
  if (isDownloadReady) {
    setDownloadText("Download Available");
  } else {
    setDownloadText("No Video to Download");
  }
  return (
    <>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <button onClick={playMedia}>Record</button>
      <button onClick={pauseMedia}>Pause</button>
      <a href={videoURL}>{downloadText}</a>
    </>
  );
}

export default SelectMedia;
