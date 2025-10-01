import { BrowserWindow, desktopCapturer } from "electron";

const POLLING_INTERVAL = 1000;

export const pollResources = async (mainWindow: BrowserWindow) => {
  let screenSources: ScreensInfo[] = [];
  let audioSources: AudioDevicesInfo[] = [];
  
  //Polling for screen sources and audio devices
  setInterval(async () => {
    screenSources = await desktopCapturer.getSources({
      types: ["screen", "window"],
    });

    // Get audio devices from the renderer process
    // Note: Audio device enumeration must happen in renderer due to security restrictions
    mainWindow.webContents.send("latestDevices", { screenSources });
  }, POLLING_INTERVAL);
};
