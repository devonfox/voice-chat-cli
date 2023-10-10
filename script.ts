import { ConversationClient } from "./conversation";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const client: ConversationClient = new ConversationClient(
    process.env.OPENAI_API_KEY!
  );
  client.run();
}

main();
