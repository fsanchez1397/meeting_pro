import React from "react";
import DisplayDevices from "./DisplayDevices";

function AudioDropdown({ audioDevices }: AudioDropDownProps): JSX.Element {
  return (
    <div>
      <ul>
        {audioDevices.map((device) => (
          <DisplayDevices device={device} />
        ))}
      </ul>
    </div>
  );
}

export default AudioDropdown;
