import { useState } from "react";
function SelectMedia() {

  // async function getMedia(constraints) {
  //   let stream = null;
  
  //   try {
  //     stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     /* use the stream */
  //   } catch (err) {
  //     /* handle the error */
  //   }
  // }

  // getMedia({
  //   audio: true,
  //   video: {
  //     width: { min: 1024, ideal: 1280, max: 1920 },
  //     height: { min: 576, ideal: 720, max: 1080 },
  //   },
  // });

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  async function getMediaDevices() {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      
      setDevices(allDevices)
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  }
  
  // Call the function
 
  

  return (
<>
<button onClick={() => getMediaDevices()}>
  Get list of Media Sources
</button>
{devices.length > 0 ? (
          devices.map((device, index) => (
            <p key={index}>
              {device.kind}: {device.label || "Unnamed device"} (ID: {device.deviceId})
            </p>
          ))
        ) : (
          <p>No devices found</p>
        )}
</>
    
  )
}

export default SelectMedia