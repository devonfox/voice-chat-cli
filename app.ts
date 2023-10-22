import { ConversationClient } from "./ConversationClient";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function main() {
  const apiKey: string | undefined = process.env.OPENAI_API_KEY;
  const promptAudioPath: string = path.join(__dirname, "prompt.wav");

  if (apiKey) {
    try {
      const client: ConversationClient = new ConversationClient(
        apiKey,
        promptAudioPath
      );
      await client.run().then(() => {
        if (fs.existsSync(promptAudioPath)) {
          fs.unlink(promptAudioPath, (error) => {
            if (error) {
              console.error(`Error deleting the file: ${error}`);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      process.exit(0);
    }
  } else {
    console.error("OPENAI_API_KEY env variable is not defined.");
  }
}

main();
