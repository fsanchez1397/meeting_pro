import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import RecordScreen from "./capturers/RecordScreen";
import "./App.css";
import ScreensDropdown from "./capturers/ScreensDropdown";
import AudioDropdown from "./capturers/AudioDropdown";

function App() {
  const [count, setCount] = useState(0);
  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    audioDevice: "",
    videoDevice: "",
    allAudioDevices: [],
    allVideoDevices: [],
    audioConstraints: null,
  });
  const [allAudio, setAllAudio] = useState<AudioDevicesInfo[]>([{ name: "" }]);
  const [allScreens, setAllScreens] = useState<ScreensInfo[]>([
    {
      name: "Empty",
      id: "",
      thumbnail: () => null,
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
  useEffect(() => {}, []);
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Keep Going I Still Believe!!</h1>
      <ScreensDropdown screens={allScreens} />
      <AudioDropdown audioDevices={allAudio} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {/* Should remove and use this to activate recording */}
        <RecordScreen setScreens={setScreens} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
