import { useContext, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import RecordAudio from "../components/buttons/RecordAudio";
import DownloadAudio from "../components/buttons/DownloadAudio";

function MediaSelection() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("MediaSelection must be used within a NotesProvider");
  }
  const {
    audioDevices,
    screenDevices,
    selectedAudioDevice,
    selectedScreenDevice,
    setAudioDevices,
    setScreenDevices,
    setSelectedAudioDevice,
    setSelectedScreenDevice,
  } = context;

  const handleAudioInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioDevice(
      audioDevices?.find((device) => {
        return device.label === e.target.value;
      }) || null
    );
  };

  useEffect(() => {
    const getDevices = async () => {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) {
          console.log("enumerateDevices() not supported.");
        } else {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setAudioDevices(
            devices.filter((device) => device.kind === "audioinput")
          );
        }
      } catch (err) {
        console.error();
      }
    };
    getDevices();
  }, [setAudioDevices]);

  console.log(selectedAudioDevice);
  return (
    <div>
      <h1>Media Selection</h1>
      <span>Audio Devices</span>
      <select id="audioDevices" onChange={handleAudioInputChange}>
        {audioDevices && audioDevices.length > 0 ? (
          audioDevices.map((device) => (
            <option key={device.deviceId}>{device.label}</option>
          ))
        ) : (
          <option>No audio devices</option>
        )}
      </select>
      <div>
        <RecordAudio />
        <DownloadAudio />
      </div>
    </div>
  );
}

export default MediaSelection;
