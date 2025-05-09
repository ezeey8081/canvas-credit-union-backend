// index.js for Vercel serverless function
// Path: api/chat.js

import OpenAI from 'openai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse request body
    const { messages, temperature = 0.7 } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid request: messages must be an array' });
      return;
    }

    // Initialize OpenAI client with API key from environment variable
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // API key should be in environment variables
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview', // Using GPT-4 Turbo (adjust as needed)
      messages: messages,
      temperature: temperature,
      max_tokens: 1000, // Adjust token limit as needed
    });

    // Return the completion
    res.status(200).json(completion);
  } catch (error) {
    console.error('Error:', error);
    
    // Return appropriate error message
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message
    });
  }
}
