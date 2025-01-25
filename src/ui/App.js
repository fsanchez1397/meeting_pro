import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import RecordScreen from "./capturers/RecordScreen";
import "./App.css";
function App() {
    const [count, setCount] = useState(0);
    const [streamInfo, setStreamInfo] = useState({
        audioDevice: "",
        videoDevice: "",
        allAudioDevices: [],
        allVideoDevices: [],
        audioConstraints: null,
    });
    const getStreamInfo = (info) => {
        setStreamInfo(info);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx("a", { href: "https://react.dev", target: "_blank", children: _jsx("img", { src: reactLogo, className: "logo react", alt: "React logo" }) }) }), _jsx("h1", { children: "Keep Going I Still Believe!!" }), _jsxs("div", { className: "card", children: [_jsxs("button", { onClick: () => setCount((count) => count + 1), children: ["count is ", count] }), _jsx(RecordScreen, { setStreamInfo: getStreamInfo })] }), _jsx("p", { className: "read-the-docs", children: "Click on the Vite and React logos to learn more" })] }));
}
export default App;
