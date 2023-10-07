import * as recorder from "node-record-lpcm16";
import * as fs from "fs";
import path from "path";
import keypress from "keypress"; // Import the keypress library

const wavPath: string = path.join(__dirname, "test.wav");

const file: fs.WriteStream = fs.createWriteStream(wavPath, {
  encoding: "binary",
});

const recordStream = recorder
  .record({
    sampleRate: 44100,
  })
  .stream();

const keyToStartRecording = "r";
let isRecording = false;

keypress(process.stdin);

process.stdin.on("keypress", (ch, key) => {
  if (key && key.name === keyToStartRecording && !isRecording) {
    console.log("Recording started.");
    isRecording = true;
    recordStream.pipe(file);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
