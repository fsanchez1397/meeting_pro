/**
 * Recordings Manager - Electron Main Process
 * Handles file system operations for recordings
 */

import { app, dialog } from "electron";
import fs from "fs";
import path from "path";

export interface RecordingMetadata {
  id: string;
  name: string;
  filePath: string;
  thumbnailPath?: string;
  date: string;
  duration: number;
  size: number;
  notes?: string;
  transcription?: string;
  aiProcessed?: boolean;
}

export interface RecordingsDatabase {
  recordings: RecordingMetadata[];
  lastUpdated: string;
}

/**
 * Get the recordings directory path
 */
export function getRecordingsDirectory(): string {
  const userDataPath = app.getPath("documents");
  return path.join(userDataPath, "MeetingPro", "Recordings");
}

/**
 * Get the metadata file path
 */
export function getMetadataFilePath(): string {
  const userDataPath = app.getPath("documents");
  return path.join(userDataPath, "MeetingPro", "recordings.json");
}

/**
 * Ensure recordings directory exists
 */
export function ensureRecordingsDirectory(): void {
  const recordingsDir = getRecordingsDirectory();
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }
}

/**
 * Load recordings metadata from JSON file
 */
export function loadRecordingsMetadata(): RecordingsDatabase {
  try {
    const metadataPath = getMetadataFilePath();
    
    if (!fs.existsSync(metadataPath)) {
      // Create empty database if it doesn't exist
      const emptyDb: RecordingsDatabase = {
        recordings: [],
        lastUpdated: new Date().toISOString(),
      };
      saveRecordingsDatabase(emptyDb);
      return emptyDb;
    }

    const data = fs.readFileSync(metadataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading recordings metadata:", error);
    return {
      recordings: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Save entire recordings database
 */
export function saveRecordingsDatabase(database: RecordingsDatabase): boolean {
  try {
    const metadataPath = getMetadataFilePath();
    const metadataDir = path.dirname(metadataPath);
    
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true });
    }

    database.lastUpdated = new Date().toISOString();
    fs.writeFileSync(metadataPath, JSON.stringify(database, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving recordings database:", error);
    return false;
  }
}

/**
 * Add a new recording to the database
 */
export function addRecording(metadata: RecordingMetadata): boolean {
  try {
    const database = loadRecordingsMetadata();
    database.recordings.push(metadata);
    return saveRecordingsDatabase(database);
  } catch (error) {
    console.error("Error adding recording:", error);
    return false;
  }
}

/**
 * Update recording metadata
 */
export function updateRecording(
  id: string,
  updates: Partial<RecordingMetadata>
): boolean {
  try {
    const database = loadRecordingsMetadata();
    const index = database.recordings.findIndex((r) => r.id === id);
    
    if (index === -1) {
      console.error("Recording not found:", id);
      return false;
    }

    database.recordings[index] = {
      ...database.recordings[index],
      ...updates,
    };
    
    return saveRecordingsDatabase(database);
  } catch (error) {
    console.error("Error updating recording:", error);
    return false;
  }
}

/**
 * Delete a recording (file and metadata)
 */
export function deleteRecording(id: string): boolean {
  try {
    const database = loadRecordingsMetadata();
    const recording = database.recordings.find((r) => r.id === id);
    
    if (!recording) {
      console.error("Recording not found:", id);
      return false;
    }

    // Delete video file
    if (fs.existsSync(recording.filePath)) {
      fs.unlinkSync(recording.filePath);
    }

    // Delete thumbnail if exists
    if (recording.thumbnailPath && fs.existsSync(recording.thumbnailPath)) {
      fs.unlinkSync(recording.thumbnailPath);
    }

    // Remove from database
    database.recordings = database.recordings.filter((r) => r.id !== id);
    
    return saveRecordingsDatabase(database);
  } catch (error) {
    console.error("Error deleting recording:", error);
    return false;
  }
}

/**
 * Save a recording blob to file
 */
export async function saveRecordingToFile(
  buffer: Buffer,
  filename?: string
): Promise<string | null> {
  try {
    ensureRecordingsDirectory();
    
    const recordingsDir = getRecordingsDirectory();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = filename || `recording-${timestamp}.mkv`;
    const filePath = path.join(recordingsDir, fileName);

    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error("Error saving recording to file:", error);
    return null;
  }
}

/**
 * Open file dialog to select save location
 */
export async function showSaveDialog(
  defaultFilename: string
): Promise<string | null> {
  try {
    const result = await dialog.showSaveDialog({
      title: "Save Recording",
      defaultPath: defaultFilename,
      filters: [
        { name: "Video Files", extensions: ["mkv", "mp4", "webm"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    return result.canceled ? null : result.filePath || null;
  } catch (error) {
    console.error("Error showing save dialog:", error);
    return null;
  }
}

/**
 * Get file size
 */
export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error("Error getting file size:", error);
    return 0;
  }
}
