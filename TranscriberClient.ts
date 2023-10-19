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
  private file: fs.WriteStream;
  private recorder: any;

  // look into better options

  constructor(key: string, audioPath?: string) {
    this.audioPath = audioPath ?? testPath;
    this.key = key;
    this.model = "whisper-1";
    this.file = fs.createWriteStream(this.audioPath, {
      encoding: "binary",
    });
    this.recorder = recorder.record({ channels: 1 });
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
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        reject(`Error: ${error.message}`);
      }
    });
  };
  public startRecord = async () => {
    this.recorder.stream().pipe(this.file);
  };

  public stopRecord = async () => {
    this.recorder.stop();
    this.file.close();
  };
}
