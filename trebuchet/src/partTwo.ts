import * as fs from "fs";

const isDigit = (char: string) => {
  const num = Number.parseInt(char);
  if (num >= 0 && num <= 9)
    return num;
  return -1;
}

const digitWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const isDigitWord = (str: string, startIndex: number, searchBackwards = false) => {
  if (searchBackwards) {
    for (let w = 0; w < digitWords.length; w++) {
      const word = digitWords[w];
      let i: number;
      for (i = 0; i < word.length && startIndex - i >= 0; i++) {
        if (word[word.length - i - 1] != str[startIndex - i])
          break;
      }
      if (i === word.length)
        return w + 1;
    }
  }

  for (let w = 0; w < digitWords.length; w++) {
    const word = digitWords[w];
    let i: number;
    for (i = 0; i < word.length && startIndex + i < str.length; i++) {
      if (word[i] != str[startIndex + i])
        break;
    }
    if (i === word.length)
      return w + 1;
  }

  return -1;
}

export const partTwo = () => {
  const inputFilePath = "./input.txt";
  const file = fs.readFileSync(inputFilePath, "utf8");
  const lines = file.split("\n");

  const calibration = [];

  lines.forEach(line => {
    if (line.length === 0) return;

    let digit1 = -1;
    let digit2 = -1;

    for (let i = 0; i < line.length && digit1 === -1; i++) {
      digit1 = isDigit(line[i]);
      if (digit1 == -1)
        digit1 = isDigitWord(line, i);
    }

    for (let i = line.length - 1; i >= 0 && digit2 === -1; i--) {
      digit2 = isDigit(line[i]);
      if (digit2 == -1)
        digit2 = isDigitWord(line, i, true);
    }

    calibration.push(digit1 * 10 + digit2);
  });

  return calibration.reduce((prev, curr) => {
    return prev + curr;
  });
}
