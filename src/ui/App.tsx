import { useEffect, useState } from "react";

import RecordScreen from "./capturers/RecordScreen";
import "./App.css";
import ScreensDropdown from "./capturers/ScreensDropdown";
import AudioDropdown from "./capturers/AudioDropdown";

function App() {
  const [count, setCount] = useState(0);
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
  }, []);
  return (
    <>
      <h1>Keep Going I Still Believe!!</h1>
      <h2>Screens</h2>
      <ScreensDropdown
        screens={allScreens}
        streamInfo={streamInfo}
        updateStreamInfo={updateStreamInfo}
      />
      <h2>Audio Devices</h2>
      <AudioDropdown audioDevices={allAudio} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {/* Should remove and use this to activate recording */}
        <RecordScreen setScreens={setScreens} />
      </div>
    </>
  );
}

export default App;
