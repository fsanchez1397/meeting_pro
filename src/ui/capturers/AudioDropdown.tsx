import React, { useState, useEffect, useRef } from "react";
import DisplayDevices from "./DisplayDevices";

function AudioDropdown({ audioDevices, onDeviceSelect, selectedDevice: externalSelectedDevice }: AudioDropDownProps): JSX.Element {
  const [selectedDevice, setSelectedDevice] = useState<string>(externalSelectedDevice || "");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync with external selected device
  useEffect(() => {
    if (externalSelectedDevice !== undefined) {
      setSelectedDevice(externalSelectedDevice);
    }
  }, [externalSelectedDevice]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);
    // Notify parent component
    if (onDeviceSelect) {
      onDeviceSelect(deviceId);
    }
  };

  // Monitor audio levels when a device is selected
  useEffect(() => {
    if (!selectedDevice) {
      // Clean up if no device selected
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      setAudioLevel(0);
      return;
    }

    // Set up audio monitoring
    const setupAudioMonitoring = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedDevice ? { exact: selectedDevice } : undefined }
        });
        
        streamRef.current = stream;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const checkAudioLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
            animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
          }
        };
        
        checkAudioLevel();
      } catch (error) {
        console.error('Error accessing audio device:', error);
      }
    };

    setupAudioMonitoring();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [selectedDevice]);

  // Determine if audio is being detected (threshold of 5)
  const isAudioDetected = audioLevel > 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      {selectedDevice && (
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: isAudioDetected ? "#22c55e" : "#6b7280",
            transition: "background-color 0.1s ease",
            boxShadow: isAudioDetected ? "0 0 8px rgba(34, 197, 94, 0.6)" : "none",
          }}
          title={isAudioDetected ? "Audio detected" : "No audio detected"}
        />
      )}
      <select value={selectedDevice} onChange={handleDeviceChange}>
        <option value="">Select Audio Device</option>
        {audioDevices.map((device) => (
          <DisplayDevices key={device.id} device={device} />
        ))}
      </select>
      
      
    </div>
  );
}

export default AudioDropdown;
