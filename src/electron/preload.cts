import { ipcRenderer } from "electron";

const electron = require("electron");

//exposeInMainWorld appends to global window object
electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStats: (callback: (stats: object) => void) => callback({}),
  getAudioDevices: async (): Promise<AudioDevicesInfo[]> => {
    // Audio device enumeration must happen in renderer context
    // This will be called from the renderer process
    return [];
  },
  subscribeDevices: (callback) => {
    electron.ipcRenderer.on("latestDevices", (_: Electron.IpcRendererEvent, sources: any) => {
      callback(sources.screenSources);
    });
  },
  updateBackendStream: (e: StreamInfo) => {
    ipcRenderer.send("updateScreen", e);
  },
  showNotification: (title: string, body: string) => {
    ipcRenderer.send("show-notification", { title, body });
  },
  // Recordings management
  getRecordings: async () => {
    return ipcRenderer.invoke("get-recordings");
  },
  saveRecording: async (buffer: ArrayBuffer, metadata: any) => {
    return ipcRenderer.invoke("save-recording", buffer, metadata);
  },
  updateRecordingMetadata: async (id: string, updates: any) => {
    return ipcRenderer.invoke("update-recording", id, updates);
  },
  deleteRecording: async (id: string) => {
    return ipcRenderer.invoke("delete-recording", id);
  },
  // AI Processing
  processWithAI: async (provider: string, options: any) => {
    return ipcRenderer.invoke("process-with-ai", provider, options);
  },
  // Folder selection
  selectFolder: async (): Promise<string | null> => {
    return ipcRenderer.invoke("select-folder");
  },
  getDefaultRecordingsPath: async (): Promise<string> => {
    return ipcRenderer.invoke("get-default-recordings-path");
  },
} satisfies Window["electron"]);
