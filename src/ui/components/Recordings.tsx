import { useState } from "react";

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

interface RecordingsProps {
  recording?: RecordingData;
  onDelete?: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
}

export default function Recordings({ recording, onDelete, onUpdateNotes }: RecordingsProps) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(recording?.notes || "");

  // Mock data if no recording provided
  const mockRecording: RecordingData = {
    id: "1",
    name: "Team Meeting - Oct 1, 2025",
    filePath: "",
    notes: "Discussion about Q4 goals and project timelines.",
    date: "2025-10-01",
    duration: 0,
    size: 0
  };

  const currentRecording = recording || mockRecording;

  const onShowNotes = () => {
    setShowNotesModal(true);
    setNotesText(currentRecording.notes || "");
  };

  const onCloseModal = () => {
    setShowNotesModal(false);
    setEditingNotes(false);
  };

  const onSaveNotes = () => {
    if (onUpdateNotes && recording) {
      onUpdateNotes(recording.id, notesText);
    }
    setEditingNotes(false);
  };

  const handleDelete = () => {
    if (onDelete && recording && confirm(`Are you sure you want to delete "${recording.name}"?`)) {
      onDelete(recording.id);
    }
  };

  return (
    <>
      <div className="recording-item">
        <div style={{ 
          width: "100%", 
          height: "100px", 
          background: "var(--surface)", 
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.5rem"
        }}>
          <span style={{ color: "var(--primary)", fontSize: "12px" }}>Preview</span>
        </div>
        <div>
          <p style={{ fontWeight: "bold", margin: "0.25rem 0", fontSize: "14px" }}>{currentRecording.name}</p>
          <p style={{ fontSize: "11px", color: "var(--primary)", margin: "0.25rem 0" }}>
            {new Date(currentRecording.date).toLocaleDateString()}
          </p>
          <div className="recording-actions">
            <button onClick={() => {}} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Play</button>
            <button onClick={handleDelete} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Delete</button>
            <button onClick={onShowNotes} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Notes</button>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "var(--surface-elevated)",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <h2>{currentRecording.name}</h2>
            <h3 style={{ marginTop: "1.5rem" }}>Notes</h3>
            {editingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--primary)",
                  borderRadius: "4px",
                  padding: "1rem",
                  marginTop: "1rem",
                  fontFamily: "inherit",
                  fontSize: "14px"
                }}
              />
            ) : (
              <div style={{
                background: "var(--surface)",
                padding: "1rem",
                borderRadius: "4px",
                marginTop: "1rem",
                minHeight: "200px"
              }}>
                {currentRecording.notes || "No notes available for this recording."}
              </div>
            )}
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              {editingNotes ? (
                <>
                  <button onClick={() => setEditingNotes(false)}>Cancel</button>
                  <button onClick={onSaveNotes} style={{ background: "var(--success)" }}>Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingNotes(true)}>Edit Notes</button>
                  <button onClick={onCloseModal}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}