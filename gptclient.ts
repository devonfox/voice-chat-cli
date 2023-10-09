import * as readlineSync from "readline-sync";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat";

dotenv.config();

async function run() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let conversation: Array<ChatCompletionMessageParam> = [];

  let done = false;

  while (!done) {
    const prompt: string = readlineSync.question("\n$: ");

    if (prompt.toLowerCase() === "exit") {
      console.log("Conversation ended.");
      done = true;
    } else {
      conversation.push({ role: "user", content: prompt });

      const chatCompletion: ChatCompletion =
        await openai.chat.completions.create({
          messages: conversation,
          model: "gpt-3.5-turbo",
        });

      const response = chatCompletion.choices[0].message.content;
      console.log(`\n#: ${response}`);
      conversation.push({ role: "assistant", content: response });
    }
  }
}

run();
