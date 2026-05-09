import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

const TG_API = 'https://api.telegram.org/bot'

async function sendMessage(token: string, chatId: number, text: string) {
  await fetch(`${TG_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return Response.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 })

  const update = await req.json()
  const message = update.message
  if (!message?.text) return Response.json({ ok: true })

  const chatId = message.chat.id
  const userText = message.text

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: userText,
  })

  await sendMessage(token, chatId, text)

  return Response.json({ ok: true })
}
