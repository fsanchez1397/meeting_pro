import { useEffect, useRef, useState, memo } from "react";
import RecordBtn from "../capturers/RecordBtn";
import styles from "./LiveVideo.module.css";
const arePropsEqual = (prevProps: LiveVideoProps, newProps: LiveVideoProps) => {
  return prevProps.streamInfo === newProps.streamInfo;
};

function LiveVideo({ streamInfo, onStreamChange }: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currStream, setCurrStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const displayOptions = {
      audio: true,
      video: {
        frameRate: 30,
      },
    };

    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          displayOptions
        );

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current?.play();
          setCurrStream(stream);
          // Pass stream to parent component (App.tsx)
          if (onStreamChange) {
            onStreamChange(stream);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    getStream();
    
    return () => {
      // Clean up stream when component unmounts or streamInfo changes
      if (currStream) {
        currStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [streamInfo, onStreamChange]);

  return (
    <>
      <video
        id="current-screen"
        className={styles.video}
        ref={videoRef}
        autoPlay
        muted
      ></video>
      {/* <RecordBtn stream={currStream} /> */}
    </>
  );
}

export default memo(LiveVideo, arePropsEqual);
