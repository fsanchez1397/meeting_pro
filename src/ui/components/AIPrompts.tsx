import { useState, useEffect } from "react";

export default function AIPrompts() {
  const preMadePrompts = [
    "Take notes for this recording",
    "Make a todo list of recording",
    "Summarize this recording",
    "Analyze productivity of this meeting"
  ];
  
  const [prompts, setPrompts] = useState<string[]>(preMadePrompts);
  const [selectedPrompt, setSelectedPrompt] = useState<string>(preMadePrompts[0]);
  const [newPromptText, setNewPromptText] = useState<string>("");

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem("customPrompts");
    if (savedPrompts) {
      const customPrompts = JSON.parse(savedPrompts);
      setPrompts([...preMadePrompts, ...customPrompts]);
    }
  }, []);

  const handleAddPrompt = () => {
    if (newPromptText.trim() && !prompts.includes(newPromptText.trim())) {
      const updatedPrompts = [...prompts, newPromptText.trim()];
      setPrompts(updatedPrompts);
      
      // Save only custom prompts (excluding premade ones)
      const customPrompts = updatedPrompts.filter(p => !preMadePrompts.includes(p));
      localStorage.setItem("customPrompts", JSON.stringify(customPrompts));
      
      setNewPromptText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPrompt();
    }
  };

  return (
    <div className="ai-prompts">
      <h3 style={{ margin: "0 0 0.5rem 0", textAlign: "center" }}>AI Prompts</h3>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <label htmlFor="prompt-select">Select a prompt</label>
        <select 
          id="prompt-select"
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(e.target.value)}
        >
          {prompts.map((prompt) => (
            <option key={prompt} value={prompt}>{prompt}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginTop: "0.5rem" }}>
        <label htmlFor="new-prompt" style={{ textAlign: "center", display: "block" }}>Add a custom prompt</label>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center", justifyContent: "center" }}>
          <input 
            id="new-prompt" 
            type="text" 
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your custom prompt..."
            style={{ width: "250px" }}
          />
          <button onClick={handleAddPrompt} style={{ height: "40px" }}>Add</button>
        </div>
      </div>
    </div>
  );
}