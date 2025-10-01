import { app, BrowserWindow, ipcMain, session, Tray, nativeImage, Menu, Notification, dialog } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath, getAssetPath } from "./pathResolver.js";
import { pollResources } from "./resourceManager.js";
import * as recordingsManager from "./recordingsManager.js";

let tray: Tray | null = null;
let isQuitting = false;

app.on("ready", () => {
  // Set application name
  app.setName("Meeting Pro - Beta");
  
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
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // Create tray icon
  let trayIcon;
  try {
    // Try to load the icon (on Windows, this will use the .png, on Mac it will use .icns)
    const iconPath = getAssetPath('owl-face.png');
    trayIcon = nativeImage.createFromPath(iconPath);
    
    // Resize for tray (16x16 is a good size for most systems)
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
  } catch (error) {
    console.error('Failed to load tray icon:', error);
    // Fallback to a blank image if the icon fails to load
    trayIcon = nativeImage.createEmpty();
  }
  
  tray = new Tray(trayIcon);
  
  // Create context menu for tray icon
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
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Meeting Pro - Beta');
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

// Handle notification requests
ipcMain.on("show-notification", (event, { title, body }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title,
      body: body,
      icon: getAssetPath('owl-face.png')
    });
    notification.show();
  }
});

// Recordings management handlers
ipcMain.handle("get-recordings", async () => {
  try {
    recordingsManager.ensureRecordingsDirectory();
    const database = recordingsManager.loadRecordingsMetadata();
    return database.recordings;
  } catch (error) {
    console.error("Error getting recordings:", error);
    return [];
  }
});

ipcMain.handle("save-recording", async (event, buffer, metadata) => {
  try {
    const bufferData = Buffer.from(buffer);
    const filePath = await recordingsManager.saveRecordingToFile(bufferData);
    
    if (!filePath) {
      return false;
    }

    const size = recordingsManager.getFileSize(filePath);
    const recordingMetadata = {
      ...metadata,
      filePath,
      size,
    };

    return recordingsManager.addRecording(recordingMetadata);
  } catch (error) {
    console.error("Error saving recording:", error);
    return false;
  }
});

ipcMain.handle("update-recording", async (event, id, updates) => {
  try {
    return recordingsManager.updateRecording(id, updates);
  } catch (error) {
    console.error("Error updating recording:", error);
    return false;
  }
});

ipcMain.handle("delete-recording", async (event, id) => {
  try {
    return recordingsManager.deleteRecording(id);
  } catch (error) {
    console.error("Error deleting recording:", error);
    return false;
  }
});

// AI Processing handler (placeholder - will need API keys from settings)
ipcMain.handle("process-with-ai", async (event, provider, options) => {
  try {
    // This will be implemented once we have the AI service properly set up
    // For now, return a placeholder response
    return {
      success: false,
      error: "AI processing not yet configured. Please install required packages and add API key in Settings.",
    };
  } catch (error) {
    console.error("Error processing with AI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Folder selection handler
ipcMain.handle("select-folder", async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
      title: "Select Output Folder for Recordings",
    });
    
    return result.canceled ? null : result.filePaths[0] || null;
  } catch (error) {
    console.error("Error selecting folder:", error);
    return null;
  }
});

// Get default recordings path
ipcMain.handle("get-default-recordings-path", async () => {
  return recordingsManager.getRecordingsDirectory();
});
