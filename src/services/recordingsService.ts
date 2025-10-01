/**
 * Recordings Service - Manages recording storage and retrieval
 * 
 * Storage Strategy:
 * - Uses filesystem for video files (large binary data)
 * - Uses JSON file as lightweight database for metadata
 * - Stores metadata: id, name, path, date, duration, notes, transcription
 * 
 * File Structure:
 * - Recordings folder: C:/Users/[username]/Documents/MeetingPro/Recordings/
 * - Metadata file: C:/Users/[username]/Documents/MeetingPro/recordings.json
 * - Video files: recording-[timestamp].mkv
 * - Thumbnails: recording-[timestamp]-thumb.jpg
 */

export interface RecordingMetadata {
  id: string;
  name: string;
  filePath: string;
  thumbnailPath?: string;
  date: string;
  duration: number; // in seconds
  size: number; // in bytes
  notes?: string;
  transcription?: string;
  aiProcessed?: boolean;
}

export interface RecordingsDatabase {
  recordings: RecordingMetadata[];
  lastUpdated: string;
}

const RECORDINGS_FOLDER = "MeetingPro/Recordings";
const METADATA_FILE = "MeetingPro/recordings.json";

/**
 * Get the default recordings directory path
 */
export function getRecordingsDirectory(): string {
  // This will be called from renderer, so we use a default path
  // In production, this should be configurable via Settings
  const userHome = process.env.USERPROFILE || process.env.HOME || "";
  return `${userHome}/Documents/${RECORDINGS_FOLDER}`;
}

/**
 * Get the metadata file path
 */
export function getMetadataFilePath(): string {
  const userHome = process.env.USERPROFILE || process.env.HOME || "";
  return `${userHome}/Documents/${METADATA_FILE}`;
}

/**
 * Load recordings metadata from JSON file
 * This should be called from the main process (Electron)
 */
export async function loadRecordingsMetadata(): Promise<RecordingsDatabase> {
  try {
    // This will need to be implemented in the main process using fs
    // For now, return empty database
    return {
      recordings: [],
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error loading recordings metadata:", error);
    return {
      recordings: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Save recording metadata
 */
export async function saveRecordingMetadata(
  metadata: RecordingMetadata
): Promise<boolean> {
  try {
    // This will need to be implemented in the main process
    // Should append to recordings.json file
    console.log("Saving recording metadata:", metadata);
    return true;
  } catch (error) {
    console.error("Error saving recording metadata:", error);
    return false;
  }
}

/**
 * Update recording metadata (e.g., add notes or transcription)
 */
export async function updateRecordingMetadata(
  id: string,
  updates: Partial<RecordingMetadata>
): Promise<boolean> {
  try {
    // This will need to be implemented in the main process
    console.log("Updating recording metadata:", id, updates);
    return true;
  } catch (error) {
    console.error("Error updating recording metadata:", error);
    return false;
  }
}

/**
 * Delete a recording (both file and metadata)
 */
export async function deleteRecording(id: string): Promise<boolean> {
  try {
    // This will need to be implemented in the main process
    // Should delete video file, thumbnail, and remove from metadata
    console.log("Deleting recording:", id);
    return true;
  } catch (error) {
    console.error("Error deleting recording:", error);
    return false;
  }
}

/**
 * Generate a thumbnail from video file
 * This would typically use ffmpeg or a similar tool
 */
export async function generateThumbnail(
  videoPath: string,
  thumbnailPath: string
): Promise<boolean> {
  try {
    // This will need to be implemented in the main process
    // Could use ffmpeg: ffmpeg -i input.mkv -ss 00:00:01 -vframes 1 output.jpg
    console.log("Generating thumbnail:", videoPath, thumbnailPath);
    return true;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return false;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Create a new recording metadata object
 */
export function createRecordingMetadata(
  filePath: string,
  duration: number,
  size: number
): RecordingMetadata {
  const timestamp = new Date().toISOString();
  const id = `recording-${Date.now()}`;
  const date = new Date().toLocaleDateString();
  
  return {
    id,
    name: `Recording - ${date}`,
    filePath,
    date: timestamp,
    duration,
    size,
  };
}
