import { ConversationClient } from "./ConversationClient";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const client: ConversationClient = new ConversationClient(apiKey);
      await client.run();
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
