import * as readlineSync from 'readline-sync';

function main() {
  const name = readlineSync.question('What is your name? ');
  console.log(`Hello, ${name}! Welcome to my TypeScript Node.js app.`);
}

main();
