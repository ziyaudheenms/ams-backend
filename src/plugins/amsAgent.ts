import { FastifyRequest } from "fastify";

export interface errorProps {
  status_code?: number;
  message?: string;
  error?: string;
}

export function sendTelegramErrorLog(errorInput: errorProps, request: FastifyRequest) {

  const endpoint = request ? `${request.method} ${request.url}` : "UNKNOWN";
  const clientIp = request?.ip || "127.0.0.1";
  const userAgent = request?.headers ? (request.headers["user-agent"] || "unknown") : "unknown";
  const userId = (request as any)?.user?.id || "Anonymous";
  const timestamp = new Date().toISOString();

  setImmediate(async () => {
    try {
      const botMessage = `🚨 ERROR ALERT -> *${errorInput.message || 'Unknown error'}*

 *Time:* \`${timestamp}\`
 *Endpoint:* \`${endpoint}\`
 *Client IP:* \`${clientIp}\`
 *User Agent:* \`${userAgent}\`
 *Error Message:* \`${errorInput.message || 'Unknown error'}\`
 *Error Stack:*
\`\`\`
${errorInput.error || "No stack trace"}
\`\`\`
👤 *User:* \`${userId}\``;

      await fetch(`https://api.telegram.org/bot${process.env.AMS_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: botMessage,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Failed to send error alert to Telegram:", err);
    }
  });
}