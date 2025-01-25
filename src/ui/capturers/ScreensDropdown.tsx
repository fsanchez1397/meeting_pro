import DisplayDevices from "./DisplayDevices";
import { useEffect } from "react";
function ScreensDropdown({
  screens,
  streamInfo,
  updateStreamInfo,
}: ScreensDropdownProps): JSX.Element {
  const handleChange = (e) => {
    const selectedScreen = screens.find(
      (screen) => screen.id === e.target.value
    );
    if (selectedScreen) {
      const { thumbnail, ...screenWOThumbnail } = selectedScreen;
      updateStreamInfo("updateScreen", screenWOThumbnail);
    }
  };

  useEffect(() => {
    //this runs once
    console.log("streamInfo", streamInfo);
    window.electron.updateBackendStream(streamInfo);
  }, [streamInfo]);

  return (
    <div>
      <select onChange={handleChange} name="screens">
        {screens.length > 0 ? (
          screens.map((device) => <DisplayDevices device={device} />)
        ) : (
          <option key="empty" value="empty"></option>
        )}
      </select>
    </div>
  );
}

export default ScreensDropdown;
