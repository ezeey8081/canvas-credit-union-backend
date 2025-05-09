const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

// Create Express app
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON request body
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Canvas Credit Union API is running!');
});

// OpenAI proxy route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, temperature = 0.7, max_tokens = 1000 } = req.body;
    
    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature,
      max_tokens
    });
    
    // Return the response
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ 
      error: 'Error calling OpenAI API', 
      message: error.message 
    });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for Vercel serverless deployment
module.exports = app;
