import { useRef, useState } from "react";
import styles from "./SelectMedia.module.css";
function SelectMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoURL, setVideoURL] = useState<string | undefined>(undefined);

  let audioStream: MediaStream,
    videoStream: MediaStream,
    mixedStream: MediaStream,
    recorder: MediaRecorder,
    chunks: Blob[] = [];

  const constraintsVideo = {
    video: true,
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
      console.log(audioStream);

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
      recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);
    } catch (err) {
      console.log(err);
    }
  };
  //Handles the end of recording
  const handleStop = () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    console.log(blob);
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
  const stopMedia = () => {
    recorder.stop();
  };

  const supported = navigator.mediaDevices;
  console.log(supported);
  return (
    <>
      <video
        className={styles.recordingVideo}
        ref={videoRef}
        width="auto"
        height="auto"
        autoPlay
      ></video>
      <button className={styles.displayBtns} onClick={playMedia}>
        Record
      </button>
      <button className={styles.displayBtns} onClick={pauseMedia}>
        Pause
      </button>
      <button className={styles.displayBtns} onClick={stopMedia}>
        Stop Recording
      </button>
      <a
        className={styles.displayBtns}
        href={videoURL}
        download="screen-recording.mp4"
      >
        Download
      </a>
    </>
  );
}

export default SelectMedia;
