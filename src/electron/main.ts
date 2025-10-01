import { app, BrowserWindow, ipcMain, session, Tray, nativeImage, Menu } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath, getAssetPath } from "./pathResolver.js";
import { pollResources } from "./resourceManager.js";

let tray: Tray | null = null;
let isQuitting = false;

app.on("ready", () => {
  // Set application name
  app.setName("Meeting Pro");
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: true,
      contextIsolation: true,
    },
    icon: getAssetPath('owl-face.png')
  });

  // Load the app
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    // Open the DevTools in development mode.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // Create tray icon
  const iconPath = getAssetPath('owl-face.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Meeting Pro',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Meeting Pro');
  tray.setContextMenu(contextMenu);
  
  // Toggle window when tray icon is clicked
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Poll resources
  pollResources(mainWindow);
  
  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
});

// Set isQuitting flag when app is about to quit
app.on('before-quit', () => {
  isQuitting = true;
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    mainWindow.show();
  }
});

ipcMain.on("updateScreen", (event, streamInfo) => {
  session.defaultSession.setDisplayMediaRequestHandler((req, cb) => {
    cb({ video: streamInfo.videoDevice, audio: "loopback" });
  });
});
