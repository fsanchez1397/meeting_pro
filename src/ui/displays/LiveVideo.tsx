import { useEffect, useRef, memo } from "react";

const arePropsEqual = (prevProps: LiveVideoProps, newProps: LiveVideoProps) => {
  return prevProps.streamInfo === newProps.streamInfo;
};

function LiveVideo(streamInfo: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const displayOptions = {
      audio: true,
      video: {
        width: 320,
        height: 240,
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
        }
      } catch (error) {
        console.error(error);
      }
    };
    getStream();
    //ToDo figure if this is necessary
    // return () => {
    //   currStream?.getTracks().forEach((track) => {
    //     track.stop();
    //   });
    // };
  }, [streamInfo]);

  return <video ref={videoRef} autoPlay></video>;
}

export default memo(LiveVideo, arePropsEqual);
