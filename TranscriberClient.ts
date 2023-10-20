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
          console.error(
            "Transcription request failed with status code:",
            response.status
          );
          reject(
            `Transcription request failed with status code: ${response.status}`
          );
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        reject(`Error: ${error.message}`);
      }
    });
  };

  public record = async () => {
    return new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(this.audioPath, {
        encoding: "binary",
      });
      const recording = recorder.record({
        sampleRate: 16000,
        channels: 1,
        endOnSilence: true,
        silence: "2.0",
        recorder: "rec",
      });
      recording
        .stream()
        .on("start", () => {
          console.log("Listening... (Say goodbye to stop)");
        })
        .on("end", () => {
          resolve();
        })
        .on("error", (err: any) => {
          console.error("recorder threw an error:", err);
          reject(err);
        })
        .pipe(file);
    });
  };
}
