import OpenAI from 'openai';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Using latest available model
      messages: messages,
      temperature: temperature,
      max_tokens: 1000,
    });

    // Return the completion
    res.status(200).json(completion);
  } catch (error) {
    console.error('Error:', error.message);
    
    // Return appropriate error message
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message
    });
  }
}
