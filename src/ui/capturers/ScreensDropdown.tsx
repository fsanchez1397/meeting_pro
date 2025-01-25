import DisplayDevices from "./DisplayDevices";

function ScreensDropdown({
  screens,
  updateStreamInfo,
}: ScreensDropdownProps): JSX.Element {
  return (
    <div>
      <select
        onChange={(e) => {
          updateStreamInfo("updateScreen", e.target.value);
        }}
        name="screens"
      >
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
