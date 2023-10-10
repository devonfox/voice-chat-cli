import * as readlineSync from "readline-sync";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat";

export class ConversationClient {
  private openai: OpenAI;
  private conversation: Array<ChatCompletionMessageParam> = [];
  private done: boolean = false;

  constructor(private apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public async run() {
    while (!this.done) {
      const prompt: string = readlineSync.question("\n$: ");

      if (prompt.toLowerCase() === "exit") {
        console.log("Conversation ended.");
        this.done = true;
      } else {
        this.conversation.push({ role: "user", content: prompt });

        const chatCompletion: ChatCompletion =
          await this.openai.chat.completions.create({
            messages: this.conversation,
            model: "gpt-3.5-turbo",
          });

        const response = chatCompletion.choices[0].message.content;
        console.log(`\n#: ${response}`);
        this.conversation.push({ role: "assistant", content: response });
      }
    }
  }
}
