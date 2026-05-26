import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: Bun.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: "claude-haiku-4-5",
  max_tokens: 30,
  messages: [
    {
      role: "user",
      content: "Hello, Claude",
    },
  ],
});

console.log(message);
