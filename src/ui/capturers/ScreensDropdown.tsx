import DisplayDevices from "./DisplayDevices";
function ScreensDropdown({ screens }: ScreensDropdownProps): JSX.Element {
  return (
    <div>
      <ul>
        {screens.map((device) => (
          <DisplayDevices device={device} />
        ))}
      </ul>
    </div>
  );
}

export default ScreensDropdown;
