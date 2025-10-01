import { useState } from "react";

interface RecordingData {
  id: string;
  name: string;
  thumbnail?: string;
  notes?: string;
  date: string;
}

export default function Recordings() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<RecordingData | null>(null);

  // Mock data - replace with actual recording data
  const mockRecording: RecordingData = {
    id: "1",
    name: "Team Meeting - Oct 1, 2025",
    notes: "Discussion about Q4 goals and project timelines.",
    date: "2025-10-01"
  };

  const onShowNotes = (recording: RecordingData) => {
    setSelectedRecording(recording);
    setShowNotesModal(true);
  };

  const onCloseModal = () => {
    setShowNotesModal(false);
    setSelectedRecording(null);
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
          <p style={{ fontWeight: "bold", margin: "0.25rem 0", fontSize: "14px" }}>{mockRecording.name}</p>
          <p style={{ fontSize: "11px", color: "var(--primary)", margin: "0.25rem 0" }}>
            {mockRecording.date}
          </p>
          <div className="recording-actions">
            <button onClick={() => {}} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Play</button>
            <button onClick={() => {}} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Delete</button>
            <button onClick={() => onShowNotes(mockRecording)} style={{ fontSize: "12px", padding: "0.4rem 0.75rem" }}>Notes</button>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedRecording && (
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
            <h2>{selectedRecording.name}</h2>
            <h3 style={{ marginTop: "1.5rem" }}>Notes</h3>
            <div style={{
              background: "var(--surface)",
              padding: "1rem",
              borderRadius: "4px",
              marginTop: "1rem",
              minHeight: "200px"
            }}>
              {selectedRecording.notes || "No notes available for this recording."}
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button onClick={onCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}