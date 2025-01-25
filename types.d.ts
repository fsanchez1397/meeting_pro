interface Window {
  electron: {
    subscribeStats: (callback: (stats: object) => void) => void;
    getAudioDevics: () => void;
    subscribeDevices: (callback: (screenInfo: ScreensInfo[]) => void) => void;
    updateBackendStream: (e) => void;
  };
}
interface RecordScreenProps {
  setScreens: (info: ScreensInfo[]) => void;
  setStreamInfo?: (info: StreamInfo) => void;
}
interface DisplayDevicesProps {
  device: AudioDevicesInfo | ScreensInfo;
}
interface ScreensDropdownProps {
  screens: ScreensInfo[];
  streamInfo: StreamInfo;
  updateStreamInfo: (e: string, newVal) => void;
}
interface AudioDropDownProps {
  audioDevices: AudioDevicesInfo[];
}
interface LiveVideoProps {
  streamInfo: StreamInfo;
}
interface StreamInfo {
  audioDevice: "";
  videoDevice: ScreensInfo;
  allAudioDevices: [];
  allVideoDevices: [];
  audioConstraints: null;
}
interface AudioDevicesInfo {
  name: string;
  id: string;
}
interface ScreensInfo {
  name: string;
  id: string;

  display_id: string;
  appIcon: NativeImage | null;
}
