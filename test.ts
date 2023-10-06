import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import * as path from "path";

const wavPath: string = path.join(__dirname, "test.wav");
const mp3Path: string = path.join(__dirname, "test.mp3");

const file: fs.WriteStream = fs.createWriteStream(wavPath, {
  encoding: "binary",
});

recorder
  .record({
    sampleRate: 44100,
  })
  .stream()
  .pipe(file);

async function convertToMP3(outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input("test.wav")
      .toFormat("mp3")
      .on("end", () => {
        console.log("Wav to Mp3 complete.");
        resolve();

        fs.unlink(wavPath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("Wave deleted successfully");
          }
        });
      })
      .on("error", (err) => {
        console.error("Error converting to MP3:", err);
        reject(err);
      })
      .save(outputPath);
  });
}

convertToMP3(mp3Path);
