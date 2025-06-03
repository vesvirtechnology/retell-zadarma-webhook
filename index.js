import express from 'express';
import fetch from 'node-fetch';
import { VoiceResponse } from 'twilio';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;

app.post('/incoming-call', async (req, res) => {
  try {
    const registerRes = await fetch('https://api.retellai.com/v1/call/register-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID,
        direction: 'inbound',
      }),
    });

    const data = await registerRes.json();
    const call_id = data.call_id;

    const sipUri = `sip:${call_id}@st4n6j0wnrl.sip.livekit.cloud`;

    const twiml = new VoiceResponse();
    twiml.dial().sip(sipUri);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
