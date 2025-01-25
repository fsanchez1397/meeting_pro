const electron = require("electron");

//exposeInMainWorld appends to global window object
electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStats: (callback: (stats: object) => void) => callback({}),
  getdata: (e: void) => console.log("Test ", e),
  getAudioDevics: () => {},
  subscribeDevices: (callback) => {
    electron.ipcRenderer.on("latestDevices", (_, sources) => {
      callback(sources.screenSources);
    });
  },
} satisfies Window["electron"]);
