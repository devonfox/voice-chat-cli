import * as readlineSync from 'readline-sync';
import OpenAI from "openai";

async function run() {
//   const name = readlineSync.question('\nWhat is your name? ');
//   console.log(`Hello, ${name}! Welcome to my TypeScript Node.js app.`);
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
    });
    console.log("AI's response:", chatCompletion.choices[0].message.content);
}

run();
