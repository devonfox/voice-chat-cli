import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";
import * as dotenv from "dotenv";

dotenv.config();

const wavPath: string = path.join(__dirname, "test.wav");
const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;

const model: string = "whisper-1";

const transcribe = async (audioPath: string) => {
  const formData: FormData = new FormData();
  formData.append("file", fs.createReadStream(audioPath));
  formData.append("model", model);

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    console.error("Error:", response.statusText);
  }
};

async function recordAudio(duration: number) {
  const file = fs.createWriteStream(wavPath, { encoding: "binary" });
  const recording = recorder.record({ channels: 1 });

  recording.stream().pipe(file);

  await new Promise((resolve: any) => setTimeout(resolve, duration * 1000));

  await recording.stop();
  file.close();
}

async function main(args: string[] = process.argv.slice(2)) {
  try {
    const recordingDurationInSeconds: number = parseInt(args[0]);
    await recordAudio(recordingDurationInSeconds);
    console.log("Recording finished.");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await transcribe(wavPath);
    process.exit(0);
  }
}

main();
