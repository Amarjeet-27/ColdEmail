const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY missing in .env");
    return res.status(500).json({ error: "Server Configuration Error" });
  }

  const MODEL_ID = "gemini-2.5-flash";
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [{ text: messages[0].content }],
          },
        ],
        // Optional: you can add generationConfig here if needed
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // Using the header method from your curl example
        },
        timeout: 30000,
      },
    );

    // Parsing the 2026 Gemini Response structure
    if (response.data.candidates && response.data.candidates[0].content) {
      const generatedText = response.data.candidates[0].content.parts[0].text;

      // Send back in format frontend expects
      res.json({ content: [{ text: generatedText }] });
    } else {
      throw new Error("Invalid response structure from Gemini API");
    }
  } catch (error) {
    console.error(
      "❌ Gemini API Error:",
      error.response?.data || error.message,
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || "Generation failed",
    });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Gemini Proxy running on http://localhost:${PORT}`),
);
