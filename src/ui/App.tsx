import { useEffect, useState } from "react";
import "./App.css";
import ScreensDropdown from "./capturers/ScreensDropdown";
import AudioDropdown from "./capturers/AudioDropdown";
import LiveVideo from "./displays/LiveVideo";
import AIPrompts from "./components/AIPrompts";
import RecordBtn from "./capturers/RecordBtn";
import Tray from "./components/Tray";
import Settings from "./components/Settings";
function App() {
  const [currStream, setCurrStream] = useState<MediaStream | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [captureSystemAudio, setCaptureSystemAudio] = useState<boolean>(true);
  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    audioDevice: "",
    videoDevice: {
      name: "",
      id: "",
      display_id: "",
      appIcon: null,
    },
    allAudioDevices: [],
    allVideoDevices: [],
    audioConstraints: null,
  });
  const [allAudio, setAllAudio] = useState<AudioDevicesInfo[]>([
    { name: "", id: "" },
  ]);
  const [allScreens, setAllScreens] = useState<ScreensInfo[]>([
    {
      name: "Empty",
      id: "",
    
      display_id: "",
      appIcon: null,
    },
  ]);
  //These will constantly update the screens and audio devices to be displayed
  const setScreens = (info: ScreensInfo[]) => {
    setAllScreens(info);
  };
  const setAudioDevices = (info: AudioDevicesInfo[]) => {
    setAllAudio(info);
  };
  //ToDo: assign types to the event and newVal
  const updateStreamInfo = (e: string, newVal: ScreensInfo) => {
    switch (e) {
      case "updateScreen":
        setStreamInfo({ ...streamInfo, videoDevice: newVal });

        break;
    }
  };
  //ToDo: unsubscribe from the devices
  useEffect(() => {
    window.electron.subscribeDevices((sources) => {
      setScreens(sources);
    });

    // Enumerate audio devices
    const getAudioDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            name: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
            id: device.deviceId
          }));
        setAudioDevices(audioInputs);
      } catch (error) {
        console.error('Error enumerating audio devices:', error);
      }
    };

    getAudioDevices();

    // Re-enumerate when devices change
    navigator.mediaDevices.addEventListener('devicechange', getAudioDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getAudioDevices);
    };
  }, []);
  return (
    <>
      <div className="header-bar">
        <h1 style={{ margin: 0 }}>Meeting Pro</h1>
        <button onClick={() => setShowSettings(true)} style={{ padding: "0.75rem 1.5rem" }}>
          ⚙️ Settings
        </button>
      </div>
      
      <div className="main-content">
        <div id="video-box" style={{ flex: 1, background: "#000" }}>
          {/*If no video source is active then a Dark Placeholder box else replace with the LiveVideo component*/}
          {streamInfo.videoDevice.id !== "" ? (
            <LiveVideo 
              streamInfo={streamInfo} 
              onStreamChange={setCurrStream}
              audioDeviceId={selectedAudioDevice}
              captureSystemAudio={captureSystemAudio}
            />
          ) : (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              color: "var(--primary)"
            }}>
              <p>Select a video source to begin</p>
            </div>
          )}
        </div>
        
        <div className="controls-panel" style={{ flex: 1 }}>
          {/* Recording Controls */}
          {currStream && (
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0", textAlign: "center" }}>Recording Controls</h3>
              <RecordBtn 
                stream={currStream}
                audioDeviceId={selectedAudioDevice}
              />
            </div>
          )}
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <h3 id="screens" style={{ margin: "0 0 0.5rem 0" }}>Video Sources</h3>
            <ScreensDropdown
              screens={allScreens}
              streamInfo={streamInfo}
              updateStreamInfo={updateStreamInfo}
            />
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <h3 id="audio-devices" style={{ margin: "0 0 0.5rem 0" }}>Audio Devices</h3>
            <AudioDropdown 
              audioDevices={allAudio} 
              onDeviceSelect={setSelectedAudioDevice}
              selectedDevice={selectedAudioDevice}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              <input 
                type="checkbox" 
                checked={captureSystemAudio}
                onChange={(e) => setCaptureSystemAudio(e.target.checked)}
              />
              Capture System Audio
            </label>
          </div>
          
          <AIPrompts />
        </div>
      </div>

      <div className="tray-section">
        <Tray />
      </div>
      
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

export default App;
