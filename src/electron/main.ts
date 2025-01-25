import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { pollResources } from "./resourceManager.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // mainWindow.webContents.send();
  pollResources(mainWindow);
});

ipcMain.on("updateScreen", (event, streamInfo) => {
  session.defaultSession.setDisplayMediaRequestHandler((req, cb) => {
    cb({ video: streamInfo.videoDevice, audio: "loopback" });
  });
});
