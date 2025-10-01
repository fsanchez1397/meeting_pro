import { useState } from "react";
import "./Settings.css";

type SettingsTab = "general" | "output" | "audio" | "video" | "advanced";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={activeTab === "general" ? "tab-active" : ""}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={activeTab === "output" ? "tab-active" : ""}
              onClick={() => setActiveTab("output")}
            >
              Output
            </button>
            <button
              className={activeTab === "audio" ? "tab-active" : ""}
              onClick={() => setActiveTab("audio")}
            >
              Audio
            </button>
            <button
              className={activeTab === "video" ? "tab-active" : ""}
              onClick={() => setActiveTab("video")}
            >
              Video
            </button>
            <button
              className={activeTab === "advanced" ? "tab-active" : ""}
              onClick={() => setActiveTab("advanced")}
            >
              Advanced
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === "general" && (
              <div>
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label htmlFor="app-name">Application Name</label>
                  <input type="text" id="app-name" defaultValue="Meeting Pro" />
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Launch on startup
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Minimize to tray on close
                  </label>
                </div>
              </div>
            )}

            {activeTab === "output" && (
              <div>
                <h3>Output Settings</h3>
                <div className="setting-item">
                  <label htmlFor="output-folder">Default Output Folder</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input 
                      type="text" 
                      id="output-folder" 
                      defaultValue="C:/Users/Documents/Recordings"
                      style={{ flex: 1 }}
                    />
                    <button>Browse</button>
                  </div>
                </div>
                <div className="setting-item">
                  <label htmlFor="output-format">Output Format</label>
                  <select id="output-format">
                    <option value="mkv">MKV</option>
                    <option value="mp4">MP4</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Send notes to email after recording
                  </label>
                </div>
                <div className="setting-item">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="your@email.com" />
                </div>
              </div>
            )}

            {activeTab === "audio" && (
              <div>
                <h3>Audio Settings</h3>
                <div className="setting-item">
                  <label htmlFor="audio-quality">Audio Quality</label>
                  <select id="audio-quality">
                    <option value="high">High (320 kbps)</option>
                    <option value="medium">Medium (192 kbps)</option>
                    <option value="low">Low (128 kbps)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable system audio capture
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable microphone audio
                  </label>
                </div>
                <div className="setting-item">
                  <label htmlFor="audio-codec">Audio Codec</label>
                  <select id="audio-codec">
                    <option value="opus">Opus</option>
                    <option value="aac">AAC</option>
                    <option value="mp3">MP3</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "video" && (
              <div>
                <h3>Video Settings</h3>
                <div className="setting-item">
                  <label htmlFor="video-quality">Video Quality</label>
                  <select id="video-quality">
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="480p">480p (SD)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="framerate">Frame Rate</label>
                  <select id="framerate">
                    <option value="60">60 FPS</option>
                    <option value="30">30 FPS</option>
                    <option value="24">24 FPS</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="video-codec">Video Codec</label>
                  <select id="video-codec">
                    <option value="h264">H.264</option>
                    <option value="vp9">VP9</option>
                    <option value="av1">AV1</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Show cursor in recording
                  </label>
                </div>
              </div>
            )}

            {activeTab === "advanced" && (
              <div>
                <h3>Advanced Settings</h3>
                <div className="setting-item">
                  <label htmlFor="ai-provider">AI Provider</label>
                  <select id="ai-provider">
                    <option value="gemini">Google Gemini</option>
                    <option value="chatgpt">ChatGPT</option>
                    <option value="claude">Claude</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="api-key">API Key</label>
                  <input type="password" id="api-key" placeholder="Enter your API key" />
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Enable hardware acceleration
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Enable debug logging
                  </label>
                </div>
                <div className="setting-item">
                  <label htmlFor="transcription-language">Transcription Language</label>
                  <select id="transcription-language">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onClose} style={{ background: "var(--success)" }}>Save</button>
        </div>
      </div>
    </div>
  );
}
