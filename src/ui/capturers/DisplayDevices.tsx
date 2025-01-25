function DisplayDevices({ device }: DisplayDevicesProps): JSX.Element {
  return (
    <option key={device.id} value={device.id}>
      {device.name}
    </option>
  );
}

export default DisplayDevices;
