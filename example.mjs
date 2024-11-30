import OpenAI from "openai";
import process from "process";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Make a list of 10 low calorie sweets at supermarkets.",
    },
  ],
});

console.log(completion.choices[0].message);
