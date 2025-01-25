import { BrowserWindow, desktopCapturer } from "electron";

const POLLING_INTERVAL = 1000;

export const pollResources = async (mainWindow: BrowserWindow) => {
  let screenSources: ScreensInfo[] = [];

  //Polling for screen sources
  setInterval(async () => {
    screenSources = await desktopCapturer.getSources({
      types: ["screen", "window"],
    });
    //Send screen sources to the Preload.cts process
    mainWindow.webContents.send("latestDevices", { screenSources });
  }, POLLING_INTERVAL);
};
