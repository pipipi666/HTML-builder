const process = require('process');
const fs = require('fs');
const path = require('node:path');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, '/text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Введите текст:');

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  } else {
    writeStream.write(line);
  }
});

rl.on('close', () => {
  console.log('Пока');
});

process.on('SIGINT', () => {
  console.log('Пока');
});
