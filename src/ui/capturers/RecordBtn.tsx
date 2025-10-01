import { useState, useRef } from "react";

interface RecordBtnProps {
  stream: MediaStream | null;
}

type RecordingState = "idle" | "recording" | "paused" | "stopped";

function RecordBtn({ stream }: RecordBtnProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const dataRef = useRef<Blob[]>([]);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const onRecord = () => {
    if (!stream) return;
    
    dataRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => dataRef.current.push(e.data);
    recorder.start();
    setRecordingState("recording");
    setRecordingTime(0);
    startTimer();
  };

  const onPause = () => {
    if (recorderRef.current && recordingState === "recording") {
      recorderRef.current.pause();
      setRecordingState("paused");
      stopTimer();
    }
  };

  const onResume = () => {
    if (recorderRef.current && recordingState === "paused") {
      recorderRef.current.resume();
      setRecordingState("recording");
      startTimer();
    }
  };

  const onStop = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stop();
    stopTimer();
    
    recorderRef.current.onstop = () => {
      const blob = new Blob(dataRef.current, {
        type: "video/x-matroska; codecs=avc1,opus",
      });
      const url = window.URL.createObjectURL(blob);
      setRecordingUrl(url);
      if (downloadLinkRef.current) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `recording-${timestamp}.mkv`;
      }
      setRecordingState("stopped");
    };
  };

  const onDownload = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.click();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
      {recordingState !== "idle" && (
        <div style={{ 
          fontSize: "1.5rem", 
          fontWeight: "bold", 
          color: recordingState === "recording" ? "var(--warning)" : "var(--text)",
          marginBottom: "0.5rem"
        }}>
          {recordingState === "recording" && "🔴 "}
          {formatTime(recordingTime)}
        </div>
      )}
      
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {recordingState === "idle" && (
          <button onClick={onRecord} style={{ background: "var(--warning)" }}>
            ● Start Recording
          </button>
        )}
        
        {recordingState === "recording" && (
          <>
            <button onClick={onPause}>⏸ Pause</button>
            <button onClick={onStop} style={{ background: "var(--warning)" }}>
              ⏹ Stop
            </button>
          </>
        )}
        
        {recordingState === "paused" && (
          <>
            <button onClick={onResume} style={{ background: "var(--success)" }}>
              ▶ Resume
            </button>
            <button onClick={onStop} style={{ background: "var(--warning)" }}>
              ⏹ Stop
            </button>
          </>
        )}
        
        {recordingState === "stopped" && recordingUrl && (
          <>
            <button onClick={onDownload} style={{ background: "var(--success)" }}>
              ⬇ Download Recording
            </button>
            <button onClick={onRecord} style={{ background: "var(--warning)" }}>
              ● New Recording
            </button>
          </>
        )}
      </div>
      
      <a ref={downloadLinkRef} style={{ display: "none" }}>
        Download
      </a>
    </div>
  );
}

export default RecordBtn;
