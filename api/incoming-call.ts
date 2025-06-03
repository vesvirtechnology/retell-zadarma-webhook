import { VercelRequest, VercelResponse } from '@vercel/node'
import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse'

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { RETELL_API_KEY, RETELL_AGENT_ID } = process.env

  const registerRes = await fetch('https://api.retellai.com/v1/call/register-phone-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent_id: RETELL_AGENT_ID,
      direction: 'inbound'
    })
  })

  const data = await registerRes.json()
  const call_id = data.call_id

  const sipURI = `sip:${call_id}@5t4n6j0wnrl.sip.livekit.cloud`

  const twiml = new VoiceResponse()
  const dial = twiml.dial()
  dial.sip(sipURI)

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(twiml.toString())
}

export default handler
