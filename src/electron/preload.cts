import { ipcRenderer } from "electron";

const electron = require("electron");

//exposeInMainWorld appends to global window object
electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStats: (callback: (stats: object) => void) => callback({}),
  getAudioDevics: () => {},
  subscribeDevices: (callback) => {
    electron.ipcRenderer.on("latestDevices", (_, sources) => {
      callback(sources.screenSources);
    });
  },
  updateBackendStream: (e: StreamInfo) => {
    ipcRenderer.send("updateScreen", e);
  },
} satisfies Window["electron"]);
