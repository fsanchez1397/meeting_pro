function SelectMedia() {
  const openMediaSelection = () => {
    const { BrowserWindow, desktopCapturer, session } = window.electron;
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    session.defaultSession.setDisplayMediaRequestHandler(
      (request, callback) => {
        desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
          // Grant access to the first screen found.
          console.log(request);
          callback({ video: sources[0], audio: "loopback" });
        });
      }
    );
    mainWindow.loadURL("http://localhost:3000");
  };

  return (
    <>
      <button onClick={openMediaSelection}>Get list of Media Sources</button>
      <p>WooT</p>
    </>
  );
}

export default SelectMedia;
