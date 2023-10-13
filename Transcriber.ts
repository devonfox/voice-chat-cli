import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const wavPath: string = path.join(__dirname, "prompt.wav");

export class Transcriber {
  private audioPath: string;
  private key: string;

  constructor(key: string, audioPath?: string) {
    this.audioPath = audioPath ?? wavPath;
    this.key = key;
  }

  public transcribe = async (): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      const model: string = "whisper-1"; // OpenAI transcription model
      const formData: FormData = new FormData();
      formData.append("file", fs.createReadStream(this.audioPath));
      formData.append("model", model);

      try {
        const response = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.key}`,
              ...formData.getHeaders(),
            },
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          resolve(data.text);
        } else {
          const errorText = await response.text();
          console.error("Error:", errorText);
          reject(`Error: ${response.status} - ${errorText}`);
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        reject(`Error: ${error.message}`);
      }
    });
  };
  public async recordAudio(duration: number) {
    const file = fs.createWriteStream(wavPath, { encoding: "binary" });

    // look into better options
    const recording = recorder.record({ channels: 1 });

    recording.stream().pipe(file);

    await new Promise((resolve: any) => setTimeout(resolve, duration * 1000));
    await recording.stop();
    file.close();
  }
}
