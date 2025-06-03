import express from 'express';
import { config } from 'dotenv';
import { VoiceResponse } from 'twilio';

config();

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Conectando con tu asistente de inteligencia artificial.');
  twiml.connect().stream({
    url: `wss://api.retellai.com/v1/stream`,
    name: 'retell-stream',
    parameters: {
      agent_id: process.env.RETELL_AGENT_ID,
      api_key: process.env.RETELL_API_KEY
    }
  });
  res.type('text/xml');
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook listening on port ${PORT}`));

