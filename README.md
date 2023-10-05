# Untitled Node.js App

Current idea is to create a Node.js CLI app listens for audio within a certain threshold or by keypress. Subsequently, the audio is translated or processed by the chat GPT api, and returns a response via text.

## Learning Goals

- Learn about TypeScript build
- Learn more about Node
- Create a CI/CD Test Pipeline

## Setting up

To install dependencies:

```
npm init
npm install readline-sync typescript --save-dev
npm i --save-dev @types/readline-sync
```

Then to compile TypeScript project:

```
npx tsc
```

To run the project after compilation:

```
node dist/index.js

```
