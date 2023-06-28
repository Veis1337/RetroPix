// Import the necessary modules
const axios = require('axios');
require('dotenv').config();

// Function to generate the bot response
async function generateBotResponse(messages, responsePrompt) {
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer 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` // Use the environment variable for API key
  };

  const requestData = {
    messages: messages,
    model: 'gpt-3.5-turbo',
    max_tokens: 200,
    temperature: 0.9,
    frequency_penalty: 0.7,
    n: 1,
    stop: '\n',
    prompt: responsePrompt
  };

  try {
    const response = await axios.post(API_URL, requestData, { headers });
    // Handle the API response
    console.log(response.data);
    // Return or process the response as needed
    return response.data;
  } catch (error) {
    // Handle the error
    console.error(error);
    // Return an appropriate error response
    throw error;
  }
}

module.exports = {
  generateBotResponse
};
