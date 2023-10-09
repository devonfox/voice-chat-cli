import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import path from "path";

const wavPath: string = path.join(__dirname, "test.wav");

export async function record() {
  const file: fs.WriteStream = fs.createWriteStream(wavPath, {
    encoding: "binary",
  });

  const recording = recorder.record({
    channels: 1,
  });

  recording.stream().pipe(file);

  setTimeout(() => {
    recording.stop();
  }, 5000);
}

record();
