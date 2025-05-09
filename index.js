// File: /api/chat.js (for Vercel)

// Import necessary libraries
import { OpenAI } from 'openai';

// Initialize OpenAI with your API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set appropriate CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests for actual processing
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request for debugging
    console.log('Received request:', JSON.stringify(req.body, null, 2));

    // Extract messages from request body
    const { messages, temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Ensure the system message is preserved
    let messageArray = [...messages];
    
    // Call OpenAI API
    console.log('Calling OpenAI with messages:', JSON.stringify(messageArray, null, 2));
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Or gpt-3.5-turbo for a more affordable option
      messages: messageArray,
      temperature: temperature,
      max_tokens: 1000,
    });

    console.log('OpenAI response:', JSON.stringify(completion, null, 2));

    // Return the response
    return res.status(200).json(completion);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Return appropriate error
    return res.status(500).json({ 
      error: 'Error processing your request',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
