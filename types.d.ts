interface Window {
  electron: {
    subscribeStats: (callback: (stats: object) => void) => void;
    getdata: (e: void) => void;
    getAudioDevics: () => void;
    subscribeDevices: (callback: (screenInfo: string[]) => void) => void;
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
}
interface AudioDropDownProps {
  audioDevices: AudioDevicesInfo[];
}
interface StreamInfo {
  audioDevice: "";
  videoDevice: "";
  allAudioDevices: [];
  allVideoDevices: [];
  audioConstraints: null;
}
interface AudioDevicesInfo {
  name: string;
}
interface ScreensInfo {
  name: string;
  id: string;
  thumbnail: NativeImage;
  display_id: string;
  appIcon: NativeImage | null;
}
