const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define your OpenAI API key here or load it from environment variables
const openaiApiKey = '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';

// Handle the /generate-uml endpoint
app.post('/generate-uml', async (req, res) => {
    const userCode = req.body.code;

    // Create the API request to OpenAI using the stored API key
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that converts code to PlantUML format.' },
            { role: 'user', content: userCode },
        ],
        max_tokens: 300, // You can adjust this as needed
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPEN_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const data = await response.json();
            const chatGPTResponse = data.choices[0].message.content;

            // Further processing to convert chatGPTResponse to PlantUML format

            // Send the PlantUML result back to the client
            res.send(plantUMLCode);
        } else {
            console.error('OpenAI API Error:', response.statusText);
            res.status(500).send('Error');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
