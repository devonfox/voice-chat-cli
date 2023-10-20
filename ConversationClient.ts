import * as readlineSync from "readline-sync";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat";
import { TranscriberClient } from "./TranscriberClient";
import path from "path";

export class ConversationClient {
  private openai: OpenAI;
  private conversation: Array<ChatCompletionMessageParam>;
  private done: boolean;
  private currentPrompt: string;
  private transcriber: TranscriberClient;

  constructor(
    private apiKey: string,
    private audioPath?: string
  ) {
    this.openai = new OpenAI({ apiKey });
    this.conversation = [];
    this.currentPrompt = "";
    this.done = false;
    this.transcriber = new TranscriberClient(
      apiKey,
      audioPath ?? path.join(__dirname, "test.wav")
    );
  }

  public run = async (): Promise<void> => {
    console.log("Conversation started.");
    while (!this.done) {
      if (this.currentPrompt.trim() === "exit") {
        console.log("Conversation ended.");
        this.done = true;
      } else {
        await this.transcriber.record();
        await this.transcriber.closeFile();
        try {
          const result = await this.transcriber.transcribe();
          this.currentPrompt = "result";
          console.log(`\n$: ${this.currentPrompt}`);
        } catch (error) {
          console.error(error);
        }

        this.conversation.push({ role: "user", content: this.currentPrompt });

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
  };
}
