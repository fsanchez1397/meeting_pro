import { jsx as _jsx } from "react/jsx-runtime";
function RecordScreen({ setStreamInfo }) {
    const displayMediaOptions = {
        audio: true,
        video: {
            width: 320,
            height: 240,
            frameRate: 30,
        },
    };
    const recordScreen = async () => {
        try {
            const captureScreen = await navigator.mediaDevices.getDisplayMedia();
            console.log(captureScreen);
            setStreamInfo(null);
        }
        catch (error) {
            console.error("Error: ", error);
        }
    };
    return _jsx("button", { onClick: recordScreen, children: "Record Screens" });
}
export default RecordScreen;
