import { useState, useEffect } from "react";
import Recordings from "./Recordings";

interface RecordingData {
  id: string;
  name: string;
  filePath: string;
  thumbnailPath?: string;
  date: string;
  duration: number;
  size: number;
  notes?: string;
  transcription?: string;
}

export default function Tray() {
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const data = await window.electron.getRecordings();
      setRecordings(data || []);
    } catch (error) {
      console.error("Error loading recordings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await window.electron.deleteRecording(id);
      if (success) {
        setRecordings(recordings.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      await window.electron.updateRecordingMetadata(id, { notes });
      setRecordings(recordings.map(r => r.id === id ? { ...r, notes } : r));
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  return (
    <div className="tray">
      <h3 style={{ margin: "0 0 0.75rem 0" }}>Recordings</h3>
      {loading ? (
        <p style={{ textAlign: "center", color: "var(--primary)" }}>Loading recordings...</p>
      ) : recordings.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--primary)" }}>No recordings yet. Start recording to see them here!</p>
      ) : (
        <div className="recordings-container">
          {recordings.map((recording) => (
            <Recordings 
              key={recording.id} 
              recording={recording}
              onDelete={handleDelete}
              onUpdateNotes={handleUpdateNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}