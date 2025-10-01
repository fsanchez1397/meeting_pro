import { useEffect, useRef, useState, memo } from "react";
import RecordBtn from "../capturers/RecordBtn";
import styles from "./LiveVideo.module.css";
const arePropsEqual = (prevProps: LiveVideoProps, newProps: LiveVideoProps) => {
  return prevProps.streamInfo === newProps.streamInfo;
};

function LiveVideo({ streamInfo, onStreamChange, audioDeviceId, captureSystemAudio = true }: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currStream, setCurrStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const displayOptions = {
      audio: captureSystemAudio,
      video: {
        frameRate: 30,
      },
    };

    const getStream = async () => {
      try {
        console.group('🎥 LiveVideo - Stream Creation Debug');
        console.log('Audio Device ID:', audioDeviceId || 'None selected');
        console.log('Capture System Audio:', captureSystemAudio);
        
        // Get display media (video + optional system audio)
        const displayStream = await navigator.mediaDevices.getDisplayMedia(
          displayOptions
        );
        
        console.log('Display stream tracks:', displayStream.getTracks().map(t => ({
          kind: t.kind,
          label: t.label,
          enabled: t.enabled
        })));

        let finalStream = displayStream;

        // If a microphone is selected, add its audio track
        if (audioDeviceId) {
          try {
            console.log('Attempting to get microphone stream...');
            const micStream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: { exact: audioDeviceId } }
            });
            
            console.log('Microphone stream acquired:', micStream.getAudioTracks().map(t => ({
              label: t.label,
              enabled: t.enabled
            })));
            
            // Create a new MediaStream with video and both audio tracks
            const audioTracks = [];
            
            // Add system audio if enabled
            if (captureSystemAudio) {
              const systemAudioTracks = displayStream.getAudioTracks();
              console.log(`Adding ${systemAudioTracks.length} system audio track(s)`);
              audioTracks.push(...systemAudioTracks);
            }
            
            // Add microphone audio
            const micAudioTracks = micStream.getAudioTracks();
            console.log(`Adding ${micAudioTracks.length} microphone audio track(s)`);
            audioTracks.push(...micAudioTracks);
            
            // Combine video and audio tracks
            const videoTracks = displayStream.getVideoTracks();
            finalStream = new MediaStream([...videoTracks, ...audioTracks]);
            
            console.log('Final merged stream tracks:', finalStream.getTracks().map(t => ({
              kind: t.kind,
              label: t.label
            })));
            
          } catch (micError) {
            console.error('❌ Error accessing microphone:', micError);
            // Continue with just display stream if mic fails
          }
        } else {
          console.log('No microphone selected, using display stream only');
        }
        
        console.log('Final stream audio tracks:', finalStream.getAudioTracks().length);
        console.groupEnd();

        if (videoRef.current) {
          videoRef.current.srcObject = finalStream;
          videoRef.current.onloadedmetadata = () => videoRef.current?.play();
          setCurrStream(finalStream);
          // Pass stream to parent component (App.tsx)
          if (onStreamChange) {
            onStreamChange(finalStream);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    getStream();
    
    return () => {
      // Clean up stream when component unmounts or streamInfo changes
      if (currStream) {
        currStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [streamInfo, onStreamChange, audioDeviceId, captureSystemAudio]);

  return (
    <>
      <video
        id="current-screen"
        className={styles.video}
        ref={videoRef}
        autoPlay
        muted
      ></video>
      {/* <RecordBtn stream={currStream} /> */}
    </>
  );
}

export default memo(LiveVideo, arePropsEqual);
