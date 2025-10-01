import Recordings from "./Recordings";

export default function Tray() {
  return (
    <div className="tray">
      <h3 style={{ margin: "0 0 0.75rem 0" }}>Recordings</h3>
      <div className="recordings-container">
        {/* Display multiple recordings - currently showing mock data */}
        <Recordings />
        {/* Add more Recordings components as needed */}
      </div>
    </div>
  );
}