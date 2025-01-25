import React from "react";

function DisplayDevices({ device }: DisplayDevicesProps): JSX.Element {
  return (
    <li>
      <p>{device.name}</p>
    </li>
  );
}

export default DisplayDevices;
