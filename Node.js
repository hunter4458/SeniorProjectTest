// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript, etc.) from a public directory
app.use(express.static('public'));

// Define an endpoint for handling ChatGPT interactions
app.post('/api/interactWithChatGPT', async (req, res) => {
    try {
        // Extract user messages and other data from the request body
        const { messages, max_tokens } = req.body;

        // Construct the payload to send to the ChatGPT API (customize as needed)
        const payload = {
            messages,
            max_tokens,
            // Add any other necessary parameters for your ChatGPT API here
        };

        // Make a request to your ChatGPT API (replace with the actual API endpoint)
        const chatGPTResponse = await makeChatGPTRequest(payload);

        // Send the ChatGPT response back to the client
        res.json({ chatGPTResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to make a request to your ChatGPT API
async function makeChatGPTRequest(payload) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with your ChatGPT API endpoint

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any necessary headers (e.g., API key) for your ChatGPT API here
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('ChatGPT API request failed');
    }

    const data = await response.json();
    return data;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
