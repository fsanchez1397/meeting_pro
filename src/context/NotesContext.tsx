import { createContext, useState, ReactNode } from "react";

interface NotesContextType {
  audioDevices: MediaDeviceInfo[] | null;
  screenDevices: MediaDeviceInfo[] | null;
  selectedAudioDevice: MediaDeviceInfo | null;
  selectedScreenDevice: MediaDeviceInfo | null;
  setAudioDevices: React.Dispatch<
    React.SetStateAction<MediaDeviceInfo[] | null>
  >;
  setScreenDevices: React.Dispatch<
    React.SetStateAction<MediaDeviceInfo[] | null>
  >;
  setSelectedAudioDevice: React.Dispatch<
    React.SetStateAction<MediaDeviceInfo | null>
  >;
  setSelectedScreenDevice: React.Dispatch<
    React.SetStateAction<MediaDeviceInfo | null>
  >;
}

export const NotesContext = createContext<NotesContextType | null>(null);

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[] | null>(
    null
  );
  const [screenDevices, setScreenDevices] = useState<MediaDeviceInfo[] | null>(
    null
  );
  const [selectedAudioDevice, setSelectedAudioDevice] =
    useState<MediaDeviceInfo | null>(null);
  const [selectedScreenDevice, setSelectedScreenDevice] =
    useState<MediaDeviceInfo | null>(null);
  return (
    <NotesContext.Provider
      value={{
        audioDevices,
        screenDevices,
        selectedAudioDevice,
        selectedScreenDevice,
        setAudioDevices,
        setScreenDevices,
        setSelectedAudioDevice,
        setSelectedScreenDevice,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default NotesProvider;
