function RecordScreen({ setScreens }: RecordScreenProps): JSX.Element {
  const displayMediaOptions = {
    audio: true,
    video: {
      width: 320,
      height: 240,
      frameRate: 30,
    },
  };
  console.log(setScreens);
  //get selected screen and set to recording screen
  const recordScreen = async (): Promise<void> => {
    try {
      const captureScreen = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      // setStreamInfo(test);
      console.log(captureScreen);
      // setStreamInfo(null);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return <button onClick={recordScreen}>Record Screens</button>;
}

export default RecordScreen;
