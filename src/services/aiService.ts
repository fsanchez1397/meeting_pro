/**
 * AI Service for processing transcriptions with Google Gemini
 * 
 * Setup Instructions:
 * 1. Get API key from: https://makersuite.google.com/app/apikey
 * 2. Install package: npm install @google/generative-ai
 * 3. Store API key in Settings
 * 
 * API Documentation: https://ai.google.dev/tutorials/node_quickstart
 * 
 * Note: If you installed @google/genai, uninstall it and install @google/generative-ai instead
 */

// Try to import from the correct package
// If it fails, the user needs to install @google/generative-ai
let GoogleGenerativeAI: any;
try {
  const genAI = await import("@google/generative-ai");
  GoogleGenerativeAI = genAI.GoogleGenerativeAI;
} catch (error) {
  console.warn("@google/generative-ai not installed. AI features will be limited.");
  console.warn("Run: npm install @google/generative-ai");
}

export interface AIProcessingOptions {
  apiKey: string;
  prompt: string;
  transcription: string;
  model?: string;
}

export interface AIResponse {
  success: boolean;
  result?: string;
  error?: string;
}

/**
 * Process transcription with Google Gemini AI
 */
export async function processWithGemini(
  options: AIProcessingOptions
): Promise<AIResponse> {
  try {
    const { apiKey, prompt, transcription, model = "gemini-pro" } = options;

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required. Please add it in Settings > Advanced.",
      };
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // Construct the full prompt
    const fullPrompt = `${prompt}\n\nTranscription:\n${transcription}`;

    // Generate content
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      result: text,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Process transcription with ChatGPT (OpenAI)
 * Requires: npm install openai
 */
export async function processWithChatGPT(
  options: AIProcessingOptions
): Promise<AIResponse> {
  try {
    const { apiKey, prompt, transcription } = options;

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required. Please add it in Settings > Advanced.",
      };
    }

    // OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: transcription,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      result: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("ChatGPT API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Process transcription with Claude (Anthropic)
 * Requires: npm install @anthropic-ai/sdk
 */
export async function processWithClaude(
  options: AIProcessingOptions
): Promise<AIResponse> {
  try {
    const { apiKey, prompt, transcription } = options;

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required. Please add it in Settings > Advanced.",
      };
    }

    // Claude API call
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nTranscription:\n${transcription}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      result: data.content[0].text,
    };
  } catch (error) {
    console.error("Claude API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Main function to process with selected AI provider
 */
export async function processTranscription(
  provider: "gemini" | "chatgpt" | "claude",
  options: AIProcessingOptions
): Promise<AIResponse> {
  switch (provider) {
    case "gemini":
      return processWithGemini(options);
    case "chatgpt":
      return processWithChatGPT(options);
    case "claude":
      return processWithClaude(options);
    default:
      return {
        success: false,
        error: "Invalid AI provider selected",
      };
  }
}
