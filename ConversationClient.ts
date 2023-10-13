import * as readlineSync from "readline-sync";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat";
import { Transcriber } from "./Transcriber";
import path from "path";

export class ConversationClient {
  private openai: OpenAI;
  private conversation: Array<ChatCompletionMessageParam> = [];
  private done: boolean = false;
  private firstRun: boolean = true;
  private currentPrompt: string = "";
  private transcriber: Transcriber;

  constructor(private apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.currentPrompt = "";
    this.transcriber = new Transcriber(
      apiKey,
      path.join(__dirname, "prompt.wav")
    );
  }

  public async run() {
    while (!this.done) {
      if (!this.firstRun) {
        this.currentPrompt = readlineSync.question("\n$: ");
      }
      if (this.currentPrompt.trim() === "exit") {
        console.log("Conversation ended.");
        this.done = true;
        return;
      } else {
        if (this.firstRun) {
          await this.transcriber.recordAudio(8);
          await this.transcriber
            .transcribe()
            .then(async (result) => {
              this.currentPrompt = result;
              console.log(`\n$: ${this.currentPrompt}`);
            })
            .catch((error) => {
              console.error(error);
            });
          this.firstRun = false;
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
  }
}
