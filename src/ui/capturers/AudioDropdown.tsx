import React from "react";
import DisplayDevices from "./DisplayDevices";

function AudioDropdown({ audioDevices }: AudioDropDownProps): JSX.Element {
  return (
    <div>
      <select>
        {audioDevices.map((device) => (
          <DisplayDevices device={device} />
        ))}
      </select>
    </div>
  );
}

export default AudioDropdown;
