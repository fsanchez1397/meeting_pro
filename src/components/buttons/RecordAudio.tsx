import { useContext, useState } from "react";
import { NotesContext } from "../../context/NotesContext";
import styles from "./Audio.module.css";
const RecordAudio = () => {
  const context = useContext(NotesContext);

  const [url, setURL] = useState<string | undefined>(undefined);
  let stream: MediaStream | null = null;
  let mediaRecorder: MediaRecorder | null = null;
  const chunks: Array<Blob> = [];
  if (!context) {
    throw new Error("RecordAudio must be used within a NotesProvider");
  }
  const { selectedAudioDevice, selectedScreenDevice } = context;

  const getAudioStream = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        console.log("getDisplayMedia() not supported.");
      } else {
        const constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          systemAudio: "include",
        };
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          if (mediaRecorder) {
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            setURL(window.URL.createObjectURL(blob));
          } else {
            console.error("MediaRecorder is not found");
          }
          //Auto download this audio file
        };
        console.log(mediaRecorder);
      }
    } catch (err) {
      console.error();
    }
  };
  const onRecordAudio = async () => {
    try {
      await getAudioStream();
      mediaRecorder
        ? mediaRecorder.start()
        : console.error("MediaRecorder is not found");
    } catch {
      console.error("Media Recorder failed to start");
    }
  };
  const onEndRecording = () => {
    mediaRecorder
      ? mediaRecorder.stop()
      : console.error("MediaRecorder is not found");
    console.log(mediaRecorder);
  };
  return (
    <div>
      <button className={styles.displayBtns} onClick={onRecordAudio}>
        Record Audio
      </button>
      <button className={styles.displayBtns} onClick={onEndRecording}>
        Stop
      </button>
      <audio controls src={url}></audio>
    </div>
  );
};

export default RecordAudio;
