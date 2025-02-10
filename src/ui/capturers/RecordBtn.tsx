import { useState, useRef } from "react";

interface RecordBtnProps {
  stream: MediaStream | null;
}

function RecordBtn({ stream }: RecordBtnProps) {
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const dataRef = useRef<Blob[]>([]);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  let onRecord;
  let onPause;
  let onStop;
  let onDownload;
  /* ToDo add resume when paused */
  // let onResume;

  if (stream !== null) {
    const recorder = new MediaRecorder(stream);

    onRecord = () => {
      recorder.ondataavailable = (e) => dataRef.current.push(e.data);
      recorder.start();
    };

    onPause = () => {
      recorder.pause();
    };

    onStop = () => {
      recorder.stop();
      recorder.onstop = () => {
        const blob = new Blob(dataRef.current, {
          type: "video/x-matroska; codecs=avc1,opus",
        });
        const url = window.URL.createObjectURL(blob);
        setRecordingUrl(url);
        if (downloadLinkRef.current) {
          console.log(blob.size, url);
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = "recording.mkv";
        }
      };
    };

    onDownload = () => {
      if (downloadLinkRef.current) {
        downloadLinkRef.current.click();
        if (recordingUrl) {
          window.URL.revokeObjectURL(recordingUrl);
        }
      }
    };
  }

  return (
    <>
      <button onClick={onRecord}>Record</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onStop}>Stop</button>
      <a ref={downloadLinkRef} style={{ display: "none" }}>
        Download
      </a>
      <button onClick={onDownload} disabled={!recordingUrl}>
        Download
      </button>
    </>
  );
}

export default RecordBtn;
