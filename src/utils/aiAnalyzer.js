import * as math from 'mathjs';
import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyAQw8XVYRNfq0VpXfqnbNpJCRcD8evJ_7E";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export const analyzeDrawing = async (imageData, type) => {
  try {
    const prompts = {
      summarize: "Analyze this image and provide a concise summary of what you see.",
      compute: "Identify any mathematical expressions or equations in this image and provide them in a clear format that can be computed.",
      explain: "Explain the concepts shown in this image in detail."
    };

    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompts[type] || prompts.summarize },
            {
              inline_data: {
                mime_type: "image/png",
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }

    console.error('API Response:', response.data);
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('AI Analysis error:', error.response?.data || error);
    throw new Error('Failed to analyze image: ' + (error.response?.data?.error?.message || error.message));
  }
};

export const performComputation = (expression) => {
  try {
    return math.evaluate(expression);
  } catch (error) {
    console.error('Computation error:', error);
    throw error;
  }
};
