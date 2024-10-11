import { useState } from "react";
function SelectMedia() {
  const video = document.querySelector("video");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  // async function getMediaDevices() {
  //   try {
  //     const allDevices = await navigator.mediaDevices.enumerateDevices();

  //     setDevices(allDevices)
  //   } catch (err) {
  //     console.error('Error accessing media devices:', err);
  //   }
  // }

  const captureMedia = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 320,
          height: 240,
          frameRate: 30,
        },
      })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <button onClick={() => captureMedia()}>Display video of screen</button>
      <video width="320" height="240" autoPlay></video>
    </>
  );
}

export default SelectMedia;
