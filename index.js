import express from 'express';
import { twiml } from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
  const VoiceResponse = twiml.VoiceResponse;
  const response = new VoiceResponse();

  response.connect().stream({
    url: 'wss://api.retellai.com/connect',
    parameter: [
      { name: 'apiKey', value: process.env.RETELL_API_KEY },
      { name: 'agentId', value: process.env.RETELL_AGENT_ID }
    ]
  });

  res.type('text/xml');
  res.send(response.toString());
});

app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});

