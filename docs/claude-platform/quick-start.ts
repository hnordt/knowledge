import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: Bun.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: "claude-opus-4-7",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Hello, Claude",
    },
  ],
});

console.log(message.content);
