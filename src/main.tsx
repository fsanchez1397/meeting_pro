import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import NotesProvider from "./context/NotesContext.js";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotesProvider>
      <App />
    </NotesProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
