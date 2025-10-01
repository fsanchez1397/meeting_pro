# Meeting Pro - Setup Guide

## Overview
Meeting Pro is an Electron-based screen recording application with AI-powered transcription and note-taking capabilities.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Windows OS (current implementation)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Install AI Package (for Google Gemini)
```bash
npm install @google/generative-ai
```

**Note:** You installed `@google/genai` but the code uses `@google/generative-ai`. Please run:
```bash
npm uninstall @google/genai
npm install @google/generative-ai
```

### 3. Get API Keys

#### Google Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add it in the app: Settings → Advanced → API Key

#### Alternative AI Providers
- **ChatGPT (OpenAI)**: https://platform.openai.com/api-keys
- **Claude (Anthropic)**: https://console.anthropic.com/

## Running the Application

### Development Mode
```bash
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:5123
- Launch the Electron app with hot reload
- Open DevTools automatically

### Build for Production
```bash
npm run build
npm run package
```

## Features

### 1. Screen Recording
- Select video source (screen or window)
- Select audio input device
- Real-time preview
- Recording controls: Start, Pause, Resume, Stop
- System notifications for recording events

### 2. Recordings Management
- Automatic saving to `Documents/MeetingPro/Recordings/`
- Metadata stored in `Documents/MeetingPro/recordings.json`
- View, play, and delete recordings
- Add and edit notes for each recording

### 3. AI Processing
- Process transcriptions with AI prompts
- Pre-made prompts:
  - Take notes for this recording
  - Make a todo list
  - Summarize the recording
  - Analyze meeting productivity
- Custom prompts (saved to localStorage)
- Support for multiple AI providers

### 4. Settings
- **General**: App name, startup options, tray behavior
- **Output**: Output folder, format, email integration
- **Audio**: Quality, codec, system/mic audio
- **Video**: Quality, framerate, codec
- **Advanced**: AI provider, API key, hardware acceleration

## File Structure

```
meeting_pro/
├── src/
│   ├── electron/          # Main process
│   │   ├── main.ts        # Entry point
│   │   ├── preload.cts    # Preload script
│   │   ├── recordingsManager.ts  # File operations
│   │   └── resourceManager.ts    # Device polling
│   ├── ui/                # Renderer process
│   │   ├── App.tsx        # Main component
│   │   ├── components/    # React components
│   │   ├── capturers/     # Recording components
│   │   └── displays/      # Video display
│   └── services/          # Business logic
│       ├── aiService.ts   # AI integration
│       └── recordingsService.ts  # Recordings logic
├── assets/                # Static assets
└── types.d.ts            # TypeScript definitions
```

## Storage Strategy

### Filesystem (Video Files)
- **Location**: `C:/Users/[username]/Documents/MeetingPro/Recordings/`
- **Format**: `recording-[timestamp].mkv`
- **Why**: Large binary files are better stored on disk

### JSON Database (Metadata)
- **Location**: `C:/Users/[username]/Documents/MeetingPro/recordings.json`
- **Contains**: 
  - Recording ID
  - Name
  - File path
  - Date, duration, size
  - Notes
  - Transcription
  - AI processing status
- **Why**: Lightweight, easy to query, no external database needed

## API Integration

### Google Gemini Example
```typescript
import { processWithGemini } from './services/aiService';

const result = await processWithGemini({
  apiKey: 'your-api-key',
  prompt: 'Take notes for this recording',
  transcription: 'Meeting transcript here...',
  model: 'gemini-pro' // optional
});

if (result.success) {
  console.log(result.result);
} else {
  console.error(result.error);
}
```

### Adding New AI Providers
1. Add function in `src/services/aiService.ts`
2. Update `processTranscription` switch statement
3. Add provider option in Settings component

## Troubleshooting

### "Source is not capturable" Errors
These are normal Electron warnings when scanning for available screens. They don't affect functionality.

### Audio Devices Not Showing
1. Check microphone permissions in Windows Settings
2. Restart the application
3. Try selecting a different audio device

### Recording Not Saving
1. Check that `Documents/MeetingPro/Recordings/` folder exists
2. Verify disk space
3. Check console for errors

### AI Processing Not Working
1. Verify API key is correct
2. Check internet connection
3. Ensure `@google/generative-ai` package is installed
4. Check API quota/limits

## Development Tips

### Hot Reload
Changes to React components will hot reload automatically. Changes to Electron main process require app restart.

### Debugging
- **Renderer Process**: Use Chrome DevTools (opens automatically in dev mode)
- **Main Process**: Add `console.log` statements, visible in terminal

### Adding New Features
1. Update types in `types.d.ts`
2. Add IPC handlers in `main.ts`
3. Expose functions in `preload.cts`
4. Use in React components via `window.electron`

## Security Notes

- API keys are stored in localStorage (renderer process)
- For production, consider encrypting API keys
- Never commit API keys to version control
- Use environment variables for sensitive data

## Future Enhancements

- [ ] Audio transcription (Web Speech API or external service)
- [ ] Video thumbnails generation (ffmpeg)
- [ ] Cloud storage integration
- [ ] Email delivery of notes
- [ ] Multi-language support
- [ ] Keyboard shortcuts
- [ ] Screen annotation during recording
- [ ] Webcam overlay option

## License
[Your License Here]

## Support
[Your Support Contact Here]
