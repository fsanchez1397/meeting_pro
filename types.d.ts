interface Window {
  electron: {
    subscribeStats: (callback: (stats: object) => void) => void;
    getAudioDevices: () => Promise<AudioDevicesInfo[]>;
    subscribeDevices: (callback: (screenInfo: ScreensInfo[]) => void) => void;
    updateBackendStream: (e) => void;
    showNotification: (title: string, body: string) => void;
    getRecordings: () => Promise<any>;
    saveRecording: (buffer: ArrayBuffer, metadata: any) => Promise<boolean>;
    updateRecordingMetadata: (id: string, updates: any) => Promise<boolean>;
    deleteRecording: (id: string) => Promise<boolean>;
    processWithAI: (provider: string, options: any) => Promise<any>;
    selectFolder: () => Promise<string | null>;
    getDefaultRecordingsPath: () => Promise<string>;
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
  onDeviceSelect?: (deviceId: string) => void;
  selectedDevice?: string;
}
interface LiveVideoProps {
  streamInfo: StreamInfo;
  onStreamChange?: (stream: MediaStream | null) => void;
  audioDeviceId?: string;
  captureSystemAudio?: boolean;
}
interface RecordBtnProps {
  stream: MediaStream | null;
  audioDeviceId?: string;
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
