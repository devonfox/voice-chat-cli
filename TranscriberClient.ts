import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const testPath: string = path.join(__dirname, "test.wav");

export class TranscriberClient {
  private audioPath: string;
  private key: string;
  private model: string; // OpenAI transcription model

  constructor(key: string, audioPath?: string) {
    this.audioPath = audioPath ?? testPath;
    this.key = key;
    this.model = "whisper-1";
  }

  public transcribe = async (): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      const formData: FormData = new FormData();
      formData.append("file", fs.createReadStream(this.audioPath));
      formData.append("model", this.model);

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
    const file = fs.createWriteStream(this.audioPath ?? testPath, {
      encoding: "binary",
    });

    // look into better options
    const recording = recorder.record({ channels: 1 });

    recording.stream().pipe(file);

    // Look into removing this duration and replace with a recording threshold
    await new Promise((resolve: any) => setTimeout(resolve, duration * 1000));
    await recording.stop();
    file.close();
  }
}
