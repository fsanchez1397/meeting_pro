import { useState, useRef, useEffect } from "react";

type RecordingState = "idle" | "recording" | "paused" | "stopped";
interface RecordBtnProps {
  stream: MediaStream | null;
  audioDeviceId?: string;
  mimeType?: string; // Made optional with default value
}
function getAudioMimeType(preferredType: string): string {
    return MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
}
function RecordBtn({ stream, audioDeviceId, mimeType = getAudioMimeType('audio/webm') }: RecordBtnProps) {
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
    
    // COMPREHENSIVE AUDIO DEBUGGING
    console.group('🎬 Recording Started - Audio Debug Info');
    
    const tracks = stream.getTracks();
    console.log('Total tracks:', tracks.length);
    
    tracks.forEach((track, index) => {
      console.log(`Track ${index + 1}:`, {
        kind: track.kind,
        label: track.label,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
        id: track.id
      });
    });
    
    const audioTracks = stream.getAudioTracks();
    console.log(`Audio tracks found: ${audioTracks.length}`);
    
    if (audioTracks.length === 0) {
      console.warn('⚠️ NO AUDIO TRACKS IN STREAM!');
      console.warn('Selected audio device:', audioDeviceId || 'None');
    }
    
    // Check MediaRecorder support
    const mimeTypes = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm',
      'video/x-matroska;codecs=avc1,opus'
    ];
    
    console.log('Supported MIME types:');
    mimeTypes.forEach(type => {
      console.log(`  ${type}: ${MediaRecorder.isTypeSupported(type)}`);
    });
    
    console.groupEnd();
    
    dataRef.current = [];
    
    // Use the best supported MIME type
    let mimeType = 'video/webm;codecs=vp8,opus';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus';
    }
    
    console.log('Using MIME type for recording:', mimeType);
    
    const recorder = new MediaRecorder(stream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      console.log('Data available, size:', e.data.size);
      dataRef.current.push(e.data);
    };
    recorder.start();
    setRecordingState("recording");
    setRecordingTime(0);
    startTimer();
    
    // Show notification
    const audioInfo = audioDeviceId ? "with microphone" : "without microphone";
    window.electron.showNotification(
      "Recording Started",
      `Your screen recording has started ${audioInfo}.`
    );
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

    const recorder = recorderRef.current;
    recorder.stop();
    stopTimer();
    
    recorder.onstop = () => {
      console.log('Recording stopped, creating blob...');
      console.log('Total chunks:', dataRef.current.length);
      console.log('Total size:', dataRef.current.reduce((acc, chunk) => acc + chunk.size, 0), 'bytes');
      
      // Use the mimeType from the recorder
      const mimeType = recorder.mimeType || 'video/webm';
      console.log('Creating blob with MIME type:', mimeType);
      
      const blob = new Blob(dataRef.current, { type: mimeType });
      console.log('Blob created, size:', blob.size, 'type:', blob.type);
      
      const url = window.URL.createObjectURL(blob);
      setRecordingUrl(url);
      
      if (downloadLinkRef.current) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // Use .webm extension for webm files
        const extension = mimeType.includes('webm') ? 'webm' : 'mkv';
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `recording-${timestamp}.${extension}`;
        console.log('Download link ready:', downloadLinkRef.current.download);
      }
      setRecordingState("stopped");
      
      // Show notification
      window.electron.showNotification(
        "Recording Stopped",
        "Your recording has been saved. Click Download to save it to your computer."
      );
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
            <button onClick={onDownload} style={{ width: "250px", background: "var(--success)" }}>
              ⬇ Download Recording
            </button>
            <button onClick={onRecord} style={{ width: "250px", background: "var(--warning)" }}>
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
