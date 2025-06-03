const express = require('express');
const { VoiceResponse } = require('twilio').twiml;

const app = express();
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

app.post('/', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Hola, esta es una prueba del agente de voz.');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

