import { useEffect, useRef } from "react";

function LiveVideo(streamInfo: LiveVideoProps) {
  //ToDo how ref works and why use it vs just using the state and src
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    //this keeps getting called
    console.log(streamInfo);
    const getStream = async () => {
      try {
        const displayOptions = {
          audio: true,
          video: {
            width: 320,
            height: 240,
            frameRate: 30,
          },
        };
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

export default LiveVideo;
