const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());

app.post('/generate-uml', async (req, res) => {
    const userCode = req.body.code;

    const apiKey = process.env.OPENAI_API_KEY; // Access the GitHub secret as an environment variable

    // Create a data object for the API request
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that converts code to PlantUML format.' },
            { role: 'user', content: userCode },
        ],
        max_tokens: 300,
    };
    function convertChatGPTResponseToPlantUML(response) {
        // Parse the response
        const lines = response.split('\n');
        let plantUMLCode = '';
        let isInPlantUMLBlock = false;
    
        for (const line of lines) {
            if (line.startsWith('@startuml')) {
                isInPlantUMLBlock = true;
                plantUMLCode += line + '\n';
            } else if (line.startsWith('@enduml')) {
                isInPlantUMLBlock = false;
                plantUMLCode += line + '\n';
            } else if (isInPlantUMLBlock) {
                plantUMLCode += line + '\n';
            }
        }
    
        return plantUMLCode;
    }
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Use the GitHub secret via process.env
                'Content-Type': 'application/json',
            },
        });

        const chatGPTResponse = response.data.choices[0].message.content;
        const plantUMLCode = convertChatGPTResponseToPlantUML(chatGPTResponse);
        res.send(plantUMLCode);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error generating UML');
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
